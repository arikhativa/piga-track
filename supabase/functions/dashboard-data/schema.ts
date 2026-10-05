import { z } from "zod";

export const dashboardRequestSchema = z.object({
  from: z.iso.datetime(),
  to: z.iso.datetime(),
});

const dashboardResponseSchema = z.object({
  balance: z.number(),
  income: z.number(),
  expenses: z.number(),

  incomeCategories: z.array(
    z.object({
      categoryId: z.number(),
      category: z.string(),
      amount: z.number(),
    }),
  ),

  expenseCategories: z.array(
    z.object({
      categoryId: z.number(),
      category: z.string(),
      amount: z.number(),
    }),
  ),
});

// NOTE - these are copied to the front end
type DashboardRequest = z.infer<typeof dashboardRequestSchema>;
export type DashboardResponse = z.infer<typeof dashboardResponseSchema>;
