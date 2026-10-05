import { and, gte, inArray, lt, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { transaction } from "../../../src/db/schema.ts";

import { jsonResponse } from "../../helper.ts";
import {
  transactionDataRequestSchema,
  type TransactionDataResponse,
} from "./schema.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return jsonResponse("ok");
  }

  let client;

  try {
    // TODO: the db logic should be in a helper
    const connectionString = Deno.env.get("SUPABASE_DB_URL");

    if (!connectionString) {
      throw new Error("SUPABASE_DB_URL is not configured");
    }

    client = postgres(connectionString, {
      prepare: false,
    });

    const db = drizzle(client);

    const result = transactionDataRequestSchema.safeParse(
      await req.json(),
    );

    if (!result.success) {
      return jsonResponse(
        {
          error: "Invalid request",
          issues: result.error.issues,
        },
        400,
      );
    }

    const {
      dateRange,
      bucket,
      category_list,
      tag_list,
      project_list,
    } = result.data;

    const conditions = [
      gte(
        transaction.transaction_at,
        new Date(dateRange.from),
      ),
      lt(
        transaction.transaction_at,
        new Date(dateRange.to),
      ),
    ];

    if (category_list.length > 0) {
      conditions.push(
        inArray(transaction.category_id, category_list),
      );
    }

    if (tag_list.length > 0) {
      conditions.push(
        inArray(transaction.tag_id, tag_list),
      );
    }

    if (project_list.length > 0) {
      conditions.push(
        inArray(transaction.project_id, project_list),
      );
    }

    const bucketExpression = bucket === "billing_month"
      ? sql`
					date_trunc(
						'month',
						${transaction.transaction_at} - interval '8 days'
					)
				`
      : bucket === "calendar_month"
      ? sql`
						date_trunc(
							'month',
							${transaction.transaction_at}
						)
					`
      : sql`null`;

    const rows = await db
      .select({
        bucket: bucketExpression,
        amount: sql<string>`
					coalesce(
						sum(${transaction.amount_nis}),
						0
					)
				`,
      })
      .from(transaction)
      .where(and(...conditions))
      .groupBy(bucketExpression)
      .orderBy(bucketExpression);

    const buckets = rows.map((row) => ({
      bucket: row.bucket === null
        ? "total"
        : row.bucket instanceof Date
        ? row.bucket.toISOString().slice(0, 7)
        : String(row.bucket),
      amount: Number(row.amount),
    }));

    const response: TransactionDataResponse = {
      total: buckets.reduce(
        (sum, bucket) => sum + bucket.amount,
        0,
      ),
      buckets,
    };

    return jsonResponse(response);
  } catch (error) {
    console.error(error);

    return jsonResponse(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  } finally {
    await client?.end();
  }
});
