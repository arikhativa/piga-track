import type { ImportRowStatusEnum } from "#/db/schema";

export function getRowStateVariant(stt: ImportRowStatusEnum) {
	switch (stt) {
		case "pending":
			return "secondary";
		case "merged":
			return "green";
		case "dropped":
			return "destructive";
	}
}
