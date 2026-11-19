import { ReferenceField } from "#/components/admin";
import { Badge } from "#/components/ui/badge";
import { NO_VALUE } from "#/lib/constant";

export function ProfileFullName() {
	return (
		<ReferenceField
			source="profile_id"
			reference="profile"
			empty={NO_VALUE}
			render={({ referenceRecord }) =>
				referenceRecord ? (
					<Badge
						variant={referenceRecord.first_name === "יואב" ? "blue" : "purple"}
					>
						{referenceRecord.first_name} {referenceRecord.last_name}
					</Badge>
				) : null
			}
		/>
	);
}
