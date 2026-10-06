import { and, eq, gte, inArray, lt, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { transaction, transactionCategory } from "../../../src/db/schema.ts";

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

    const bucketExpression = bucket === "calendar_month"
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

        isIncome: transactionCategory.is_income,
        isExpense: transactionCategory.is_expense,

        total: sql<string>`
					coalesce(
						sum(${transaction.amount_nis}),
						0
					)
				`,

        income: sql<string>`
					coalesce(
						sum(
							case
								when ${transaction.amount_nis} > 0
								then ${transaction.amount_nis}
								else 0
							end
						),
						0
					)
				`,

        expense: sql<string>`
					coalesce(
						sum(
							case
								when ${transaction.amount_nis} < 0
								then ${transaction.amount_nis}
								else 0
							end
						),
						0
					)
				`,
      })
      .from(transaction)
      .innerJoin(
        transactionCategory,
        eq(
          transaction.category_id,
          transactionCategory.id,
        ),
      )
      .where(and(...conditions))
      .groupBy(
        bucketExpression,
        transactionCategory.is_income,
        transactionCategory.is_expense,
      )
      .orderBy(bucketExpression);

    const buckets = rows.flatMap((row) => {
      const bucketName = row.bucket === null
        ? "total"
        : row.bucket instanceof Date
        ? row.bucket.toISOString().slice(0, 7)
        : String(row.bucket);

      const total = Number(row.total);
      const income = Number(row.income);
      const expense = Number(row.expense);

      // Category can represent both income and expense.
      if (row.isIncome && row.isExpense) {
        const result = [];

        if (income !== 0) {
          result.push({
            bucket: bucketName,
            amount: income,
            type: "income" as const,
          });
        }

        if (expense !== 0) {
          result.push({
            bucket: bucketName,
            amount: expense,
            type: "expense" as const,
          });
        }

        return result;
      }

      // Income-only category.
      if (row.isIncome) {
        return [{
          bucket: bucketName,
          amount: total,
          type: "income" as const,
        }];
      }

      // Expense-only category.
      return [{
        bucket: bucketName,
        amount: total,
        type: "expense" as const,
      }];
    });

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
