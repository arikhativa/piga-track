import type { ClassValue } from "clsx";
import { cn as realCN } from "cn";

export function cn(...inputs: ClassValue[]) {
	return realCN(inputs);
}
