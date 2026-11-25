import {
	BIT_ID,
	CAL_ID,
	CASH_ID,
	FIBI_ID,
	MAX_ID,
	PAYBOX_ID,
} from "@piga/db/schema";
import type { Identifier } from "ra-core";
import bit from "#/assets/bread-badges/bit.png";
import cal from "#/assets/bread-badges/cal.png";
import fibi from "#/assets/bread-badges/fibi.png";
import max from "#/assets/bread-badges/max.png";
import paybox from "#/assets/bread-badges/pay-box.png";
import { CashBadge } from "./CashBadge";

const badges: Record<number, { src: string; alt: string }> = {
	[BIT_ID]: { src: bit, alt: "bit" },
	[CAL_ID]: { src: cal, alt: "Cal" },
	[FIBI_ID]: { src: fibi, alt: "Fibi" },
	[MAX_ID]: { src: max, alt: "Max" },
	[PAYBOX_ID]: { src: paybox, alt: "PayBox" },
};

export function TransactionTypeBadge({ typeId }: { typeId?: Identifier }) {
	if (typeId === CASH_ID) return <CashBadge />;
	if (typeof typeId !== "number") return null;

	const badge = badges[typeId];
	if (!badge) return null;

	return (
		<img
			src={badge.src}
			alt={badge.alt}
			className="h-6 w-auto max-w-none object-contain"
		/>
	);
}
