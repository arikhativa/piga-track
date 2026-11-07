import { CheckCheck } from "lucide-react";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "#/components/ui/empty";

export function ImportRowSyncEmpty() {
	return (
		<Empty>
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<CheckCheck aria-hidden="true" />
				</EmptyMedia>
				<EmptyTitle className="text-xl">We're all synced up :)</EmptyTitle>
				<EmptyDescription>
					Nothing left to review. New items will appear here when they're ready
					to sync.
				</EmptyDescription>
			</EmptyHeader>
		</Empty>
	);
}
