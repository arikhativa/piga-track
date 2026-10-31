import {
	type TransactionDataRequestInput,
	type TransactionDataResponse,
	transactionDataRequestSchema,
	transactionDataResponseSchema,
} from "@piga/contracts/get-transaction-data";
import { supabaseClient } from "#/lib/supabaseClient";

export type { TransactionDataRequestInput as TransactionDataRequest } from "@piga/contracts/get-transaction-data";

export async function getTransactionData(
	input: TransactionDataRequestInput,
): Promise<TransactionDataResponse> {
	const body = transactionDataRequestSchema.parse(input);
	const { data, error } = await supabaseClient.functions.invoke(
		"get-transaction-data",
		{ body },
	);

	if (error) {
		throw error;
	}

	const response = transactionDataResponseSchema.safeParse(data);
	if (!response.success) {
		throw new Error(
			"get-transaction-data contract error: malformed successful response",
			{ cause: response.error },
		);
	}

	return response.data;
}
