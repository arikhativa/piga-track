import { Tabs, TabsList, TabsTrigger } from "#/components/ui/tabs";
import type { ImportBatch } from "#/db/schema";

export type BatchStatusSelectProps = {
	status: ImportBatch["status"];
	setStatus: (status: ImportBatch["status"]) => void;
};

export function BatchStatusTabs({ status, setStatus }: BatchStatusSelectProps) {
	return (
		<Tabs value={status} onValueChange={setStatus}>
			<TabsList>
				<TabsTrigger
					value="draft"
					className="dark:hover:text-gray-700 hover:text-gray-700 data-active:bg-gray-100 data-active:text-gray-700 dark:data-active:bg-gray-950 dark:data-active:text-gray-300"
				>
					Draft
				</TabsTrigger>

				<TabsTrigger
					value="approved"
					className="dark:hover:text-green-700 hover:text-green-700 data-active:bg-green-100 data-active:text-green-700 dark:data-active:bg-green-950 dark:data-active:text-green-300"
				>
					Approved
				</TabsTrigger>

				<TabsTrigger
					value="cancelled"
					className="dark:hover:text-red-700 hover:text-red-700 data-active:bg-red-100 data-active:text-red-700 dark:data-active:bg-red-950 dark:data-active:text-red-300"
				>
					Cancelled
				</TabsTrigger>
			</TabsList>
		</Tabs>
	);
}
