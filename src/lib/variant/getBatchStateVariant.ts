import type { ImportBatchStatusEnum } from "#/db/schema";

export function getBatchStatusVariant(stt: ImportBatchStatusEnum) {
	switch (stt) {
		case "draft":
			return "secondary";
		case "approved":
			return "green";
		case "cancelled":
			return "destructive";
	}
}
