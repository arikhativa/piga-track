import type { ImportRowAction } from "../types.ts";

import { merge } from "./merge.ts";
import { setCategory } from "./set-category.ts";
import { setProject } from "./set-project.ts";
import { setStatus } from "./set-status.ts";
import { setTag } from "./set-tag.ts";
import { undo } from "./undo.ts";

export const actions: Record<string, ImportRowAction> = {
  merge,
  undo,
  set_category: setCategory,
  set_project: setProject,
  set_tag: setTag,
  set_status: setStatus,
};
