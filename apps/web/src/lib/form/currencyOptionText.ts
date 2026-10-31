import type { Currency } from "@piga/db/types";

export function currencyOptionText(currency: Currency) {
	return `${currency.symbol} (${currency.iso_code})`;
}
