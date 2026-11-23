import type { ImportRowStatusEnum } from "@piga/db/types";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AlertInfo {
	className: string;
	title: string;
	description: string;
}
const statusAlertInfo: Record<ImportRowStatusEnum, AlertInfo> = {
	pending: {
		className: "bg-dark-yellow text-light-yellow",
		title: "Awaiting review",
		description: "Review the details, then approve or drop.",
	},
	merged: {
		className: "bg-dark-green text-light-green",
		title: "Review complete",
		description: "Read-only. Restore to make changes.",
	},
	dropped: {
		className: "bg-dark-pink text-light-pink",
		title: "Transaction dropped",
		description: "Details are preserved. Restore to review again.",
	},
	duplicates: {
		className: "bg-dark-purple text-light-purple",
		title: "Possible duplicate",
		description: "View the match before approving or dropping.",
	},
};

export function ImportRowStatusAlert({
	status,
}: {
	status: ImportRowStatusEnum;
}) {
	const { title, description, className } = statusAlertInfo[status];

	return (
		<Alert className={className}>
			<AlertTitle className="font-semibold">{title}</AlertTitle>
			<AlertDescription className="text-nowrap">{description}</AlertDescription>
		</Alert>
	);
}
