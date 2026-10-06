import { Badge } from "@/components/ui/badge";

export function DevBadge() {
	if (import.meta.env.MODE !== "development") {
		return null;
	}

	return (
		<Badge variant={"purple"} className="absolute top-0 right-0 z-100 ">
			DEV
		</Badge>
	);
}
