import type { Currency } from "#/db/schema";

export function currencyOptionText(currency: Currency) {
	return `${currency.symbol} (${currency.iso_code})`;
}
