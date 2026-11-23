import type { ImportRowStatusEnum } from "@piga/db/types";

export function getRowStateVariant(stt: ImportRowStatusEnum) {
	switch (stt) {
		case "pending":
			return "yellow";
		case "merged":
			return "green";
		case "dropped":
			return "pink";
		case "duplicates":
			return "purple";
	}
}
