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
					className="dark:hover:text-pink-700 hover:text-pink-700 data-active:bg-pink-100 data-active:text-pink-700 dark:data-active:bg-pink-950 dark:data-active:text-pink-300"
				>
					Expense
				</TabsTrigger>

				<TabsTrigger
					value="received"
					disabled={disabled}
					className="dark:hover:text-green-700 hover:text-green-700 data-active:bg-green-100 data-active:text-green-700 dark:data-active:bg-green-950 dark:data-active:text-green-300"
				>
					Income
				</TabsTrigger>
			</TabsList>
		</Tabs>
	);
}
