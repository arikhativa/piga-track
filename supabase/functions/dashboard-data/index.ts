import { and, eq, gte, lt, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { transaction, transactionCategory } from "../../../src/db/schema.ts";
import { jsonResponse } from "../../helper.ts";
import { dashboardRequestSchema, type DashboardResponse } from "./schema.ts";

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

    const result = dashboardRequestSchema.safeParse(await req.json());

    if (!result.success) {
      return jsonResponse(
        {
          error: "Invalid request",
          issues: result.error.issues,
        },
        400,
      );
    }

    const { from, to } = result.data;

    const rows = await db
      .select({
        categoryId: transactionCategory.id,
        category: transactionCategory.value,
        isIncome: transactionCategory.is_income,
        isExpense: transactionCategory.is_expense,

        // Used for income-only / expense-only categories.
        total: sql<string>`
					coalesce(sum(${transaction.amount_nis}), 0)
				`,

        // Used for categories that are both.
        positive: sql<string>`
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

        negative: sql<string>`
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
        eq(transaction.category_id, transactionCategory.id),
      )
      .where(
        and(
          gte(transaction.transaction_at, new Date(from)),
          lt(transaction.transaction_at, new Date(to)),
        ),
      )
      .groupBy(
        transactionCategory.id,
        transactionCategory.value,
        transactionCategory.is_income,
        transactionCategory.is_expense,
      );

    let income = 0;
    let expenses = 0;

    const incomeCategories: DashboardResponse["incomeCategories"] = [];
    const expenseCategories: DashboardResponse["expenseCategories"] = [];

    for (const row of rows) {
      const total = Number(row.total);
      const positive = Number(row.positive);
      const negative = Number(row.negative);

      // Both income + expense:
      // split positive and negative transactions.
      if (row.isIncome && row.isExpense) {
        if (positive !== 0) {
          income += positive;

          incomeCategories.push({
            categoryId: row.categoryId,
            category: row.category,
            amount: positive,
          });
        }

        if (negative !== 0) {
          expenses += negative;

          expenseCategories.push({
            categoryId: row.categoryId,
            category: row.category,
            amount: negative,
          });
        }

        continue;
      }

      // Income only:
      // sum all transactions.
      if (row.isIncome) {
        income += total;

        if (total !== 0) {
          incomeCategories.push({
            categoryId: row.categoryId,
            category: row.category,
            amount: total,
          });
        }
      }

      // Expense only:
      // sum all transactions.
      if (row.isExpense) {
        expenses += total;

        if (total !== 0) {
          expenseCategories.push({
            categoryId: row.categoryId,
            category: row.category,
            amount: total,
          });
        }
      }
    }

    const response: DashboardResponse = {
      balance: income + expenses,
      income,
      expenses,
      incomeCategories,
      expenseCategories,
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
