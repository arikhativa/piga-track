import { useExchangeRate } from "#/hooks/use-exchange-rate";

type AmountInNisProps = {
	amount: string;
	isoCode: string;
	date: string;
};

export const AmountInNis = ({ amount, isoCode, date }: AmountInNisProps) => {
	const { data: rate, isSuccess, isPending } = useExchangeRate(isoCode, date);

	if (!isSuccess || isPending) {
		return "...";
	}

	const amountInNis = Math.abs(Number(amount)) * rate;

	if (Number.isNaN(amountInNis)) {
		return "...";
	}

	return `${amountInNis.toFixed(2)} ₪`;
};
