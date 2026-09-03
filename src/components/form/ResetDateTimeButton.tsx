import { useInput } from "ra-core";
import { Button } from "@/components/ui/button";

export function ResetDateTimeButton() {
	const { field } = useInput({ source: "created_at" });

	return (
		<Button
			type="button"
			variant={"secondary"}
			onClick={() => field.onChange(new Date().toISOString())}
		>
			Now
		</Button>
	);
}
