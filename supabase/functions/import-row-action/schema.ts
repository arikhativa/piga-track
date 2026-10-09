import { z } from "zod";

// TODO i need to rethink this tpye api share with supabse funcs
export const importRowActionSchema = z.object({
  import_row_ids: z.array(z.number().int().positive()),

  profileId: z.uuid(),

  action: z.enum([
    "mergeAllPending",
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
