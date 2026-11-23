import type { Dispatch, SetStateAction } from "react";
import { Tabs, TabsList, TabsTrigger } from "#/components/ui/tabs";

export type SpentReceivedTabsProps = {
	type: "spent" | "received";
	setType: Dispatch<SetStateAction<"spent" | "received">>;
};

export function SpentReceivedTabs({
	type,
	setType,
	disabled = false,
}: SpentReceivedTabsProps & { disabled?: boolean }) {
	return (
		<Tabs
			orientation="vertical"
			value={type}
			onValueChange={(value) => setType(value as typeof type)}
		>
			<TabsList>
				<TabsTrigger
					value="spent"
					disabled={disabled}
					className="hover:text-light-pink data-active:bg-dark-pink data-active:text-light-pink"
				>
					Expense
				</TabsTrigger>

				<TabsTrigger
					value="received"
					disabled={disabled}
					className="hover:text-light-green data-active:bg-dark-green data-active:text-light-green"
				>
					Income
				</TabsTrigger>
			</TabsList>
		</Tabs>
	);
}
