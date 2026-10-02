import { z } from "zod";

export const importRowActionSchema = z.object({
  import_row_ids: z.array(z.number().int().positive()).min(1),

  profile_id: z.uuid(),

  action: z.enum([
    "merge",
    "undo",
    "set_category",
    "set_project",
    "set_tag",
    "set_status",
  ]),

  value: z.union([
    z.number().int(),
    z.string(),
    z.null(),
  ]).optional(),
});

export type ImportRowActionInput = z.infer<
  typeof importRowActionSchema
>;
