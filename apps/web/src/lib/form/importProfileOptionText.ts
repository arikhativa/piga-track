import type { ImportProfile } from "@piga/db/types";

export function importProfileOptionText(obj: ImportProfile) {
	return obj.name;
}
