import type { Dispatch, SetStateAction } from "react";
import { Tabs, TabsList, TabsTrigger } from "#/components/ui/tabs";

export type SpentReceivedTabsProps = {
	type: "spent" | "received";
	setType: Dispatch<SetStateAction<"spent" | "received">>;
};

export function SpentReceivedTabs({ type, setType }: SpentReceivedTabsProps) {
	return (
		<Tabs value={type} onValueChange={(value) => setType(value as typeof type)}>
			<TabsList>
				<TabsTrigger
					value="spent"
					className="dark:hover:text-pink-700 hover:text-pink-700 data-active:bg-pink-100 data-active:text-pink-700 dark:data-active:bg-pink-950 dark:data-active:text-pink-300"
				>
					Spent
				</TabsTrigger>

				<TabsTrigger
					value="received"
					className="dark:hover:text-green-700 hover:text-green-700 data-active:bg-green-100 data-active:text-green-700 dark:data-active:bg-green-950 dark:data-active:text-green-300"
				>
					Received
				</TabsTrigger>
			</TabsList>
		</Tabs>
	);
}
