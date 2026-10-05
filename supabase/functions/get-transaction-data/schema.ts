import { z } from "zod";

export const transactionDataRequestSchema = z.object({
  dateRange: z.object({
    from: z.iso.datetime(),
    to: z.iso.datetime(),
  }),

  bucket: z.enum([
    "none",
    "billing_month",
    "calendar_month",
  ]),

  category_list: z.array(z.number().int()).default([]),
  tag_list: z.array(z.number().int()).default([]),
  project_list: z.array(z.number().int()).default([]),
});

export type TransactionDataRequest = z.infer<
  typeof transactionDataRequestSchema
>;

export type TransactionDataResponse = {
  total: number;

  buckets: {
    bucket: string;
    amount: number;
  }[];
};
