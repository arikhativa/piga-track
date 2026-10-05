import { transaction, transactionCategory } from "../../../src/db/schema.ts";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { jsonResponse } from "../../helper.ts";
import { and, eq, gte, lt, sql } from "drizzle-orm";
import { dashboardRequestSchema } from "./schema.ts";

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

    const body = result.data;

    const from = new Date(body.from);
    const to = new Date(body.to);

    if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
      throw new Error("Invalid date range");
    }

    const rows = await db
      .select({
        categoryId: transactionCategory.id,
        category: transactionCategory.value,
        is_income: transactionCategory.is_income,
        is_expense: transactionCategory.is_expense,

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

        expenses: sql<string>`
					coalesce(
						sum(
							case
								when ${transaction.amount_nis} < 0
								then abs(${transaction.amount_nis})
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
          gte(transaction.transaction_at, from),
          lt(transaction.transaction_at, to),
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

    const incomeCategories = [];
    const expenseCategories = [];

    for (const row of rows) {
      const rowIncome = Number(row.income);
      const rowExpenses = Number(row.expenses);

      if (row.is_income) {
        income += rowIncome;

        if (rowIncome !== 0) {
          incomeCategories.push({
            categoryId: row.categoryId,
            category: row.category,
            amount: rowIncome,
          });
        }
      }

      if (row.is_expense) {
        expenses += rowExpenses;

        if (rowExpenses !== 0) {
          expenseCategories.push({
            categoryId: row.categoryId,
            category: row.category,
            amount: rowExpenses,
          });
        }
      }
    }

    return jsonResponse({
      balance: income - expenses,
      income,
      expenses,
      incomeCategories,
      expenseCategories,
    });
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
