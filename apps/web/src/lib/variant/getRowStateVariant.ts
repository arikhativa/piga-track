import type { ImportRowStatusEnum } from "@piga/db/types";

export function getRowStateVariant(stt: ImportRowStatusEnum) {
	switch (stt) {
		case "pending":
			return "secondary";
		case "merged":
			return "green";
		case "dropped":
		case "duplicates":
			return "destructive";
	}
}
