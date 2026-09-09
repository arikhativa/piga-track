import type { ImportProfile } from "#/db/schema";

export function importProfileOptionText(obj: ImportProfile) {
	return obj.name;
}
