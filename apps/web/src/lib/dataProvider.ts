import postgrestRestProvider, {
	defaultPrimaryKeys,
	defaultSchema,
	type IDataProviderConfig,
} from "@raphiniert/ra-data-postgrest";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@supabase/supabase-js";
import {
	type CreateParams,
	type CreateResult,
	type DataProvider,
	fetchUtils,
	type Identifier,
	type RaRecord,
} from "ra-core";
import {
	type CreateImportBatchInput,
	createImportBatch,
} from "#/lib/importer/createImportBatch";

type WithApiKey = {
	instanceUrl: string;
	/**
	 * The API key of the Supabase instance. Accepts both the legacy anonymous
	 * JWT key and the newer publishable key (`sb_publishable_*`).
	 * Provide `apiKey` for the default HTTP client, or supply a custom `httpClient`.
	 */
	apiKey: string;
	supabaseClient?: SupabaseClient;
};

type WithSupabaseClient = {
	instanceUrl: string;
	/**
	 * A pre-configured Supabase client. Required when `apiKey` is not provided.
	 * Without an explicit API key, provide an HTTP client that handles API-key
	 * and authorization headers without reading protected client properties.
	 */
	supabaseClient: SupabaseClient;
	apiKey?: never;
	httpClient: NonNullable<IDataProviderConfig["httpClient"]>;
};

/**
 * A function that returns a dataProvider for Supabase.
 * @param instanceUrl The URL of the Supabase instance
 * @param apiKey The API key of the Supabase instance. Accepts the legacy anonymous JWT key or the newer publishable key (`sb_publishable_*`). Required for the default HTTP client; omit only when supplying both a Supabase client and a custom HTTP client.
 * @param supabaseClient The Supabase client. Required when `apiKey` is not provided.
 * @param httpClient Optional - The httpClient to use. Defaults to a httpClient that handles the authentication.
 * @param defaultListOp Optional - The default list filter operator. Defaults to 'eq'.
 * @param primaryKeys Optional - The primary keys of the tables. Defaults to 'id'.
 * @param schema Optional - The custom schema to use. Defaults to none.
 * @returns A dataProvider for Supabase
 */
export const supabaseDataProvider = ({
	instanceUrl,
	apiKey,
	supabaseClient: supabaseClientParam,
	httpClient: httpClientParam,
	defaultListOp = "eq",
	primaryKeys = defaultPrimaryKeys,
	schema = defaultSchema,
	...rest
}: (WithApiKey | WithSupabaseClient) &
	Partial<Omit<IDataProviderConfig, "apiUrl">>): DataProvider => {
	const supabaseClient =
		supabaseClientParam ??
		(apiKey
			? createClient(instanceUrl, apiKey)
			: (() => {
					throw new Error(
						"Either apiKey or supabaseClient must be provided to supabaseDataProvider",
					);
				})());
	const httpClient =
		httpClientParam ?? supabaseHttpClient({ apiKey, supabaseClient });

	const config: IDataProviderConfig = {
		apiUrl: `${instanceUrl}/rest/v1`,
		httpClient,
		defaultListOp,
		primaryKeys,
		schema,
		...rest,
	};

	const baseProvider = postgrestRestProvider(config);

	return {
		...baseProvider,

		getList: (resource, params) => {
			if (resource !== "transaction" || !("amountType" in params.filter)) {
				return baseProvider.getList(resource, params);
			}

			const { amountType, ...filter } = params.filter;
			const amountFilter =
				amountType === "negative"
					? { "amount_nis@lt": 0 }
					: amountType === "positive"
						? { "amount_nis@gt": 0 }
						: {};

			return baseProvider.getList(resource, {
				...params,
				filter: { ...filter, ...amountFilter },
			});
		},

		create: async <
			RecordType extends Omit<RaRecord, "id"> = any,
			ResultRecordType extends RaRecord = RecordType & { id: Identifier },
		>(
			resource: string,
			params: CreateParams,
		): Promise<CreateResult<ResultRecordType>> => {
			if (resource === "import_batch") {
				const result = await createImportBatch(
					// NOTE: maybe we should have a propare check here
					params.data as CreateImportBatchInput,
				);

				return {
					// React Admin's generic result type cannot be narrowed by the resource string.
					data: result.batch as unknown as ResultRecordType,
				};
			}

			return baseProvider.create<RecordType, ResultRecordType>(
				resource,
				params,
			);
		},

		supabaseClient: (url: string, options?: any) =>
			httpClient(`${config.apiUrl}/${url}`, options),

		getSchema: async (): Promise<any> => {
			const { json } = await httpClient(`${config.apiUrl}/`, {});

			if (!json || !json.swagger) {
				throw new Error("The Open API schema is not readable");
			}

			return json;
		},
	};
};

/**
 * A function that returns a httpClient for Supabase. It handles the authentication.
 * @param apiKey The explicit API key of the Supabase instance. Accepts both legacy anonymous JWT keys and publishable keys (`sb_publishable_*`).
 * @param supabaseClient The Supabase client
 * @returns A httpClient for Supabase
 */
export const supabaseHttpClient = ({
	apiKey,
	supabaseClient,
}: {
	apiKey?: string;
	supabaseClient: SupabaseClient;
}) => {
	if (apiKey === undefined) {
		throw new Error(
			"apiKey is required for the default Supabase HTTP client; otherwise provide a custom httpClient",
		);
	}

	return async (url: string, options: any = {}) => {
		const { data } = await supabaseClient.auth.getSession();
		if (!options.headers) options.headers = new Headers({});

		if (data.session) {
			options.user = {
				authenticated: true,
				// This ensures that users are identified correctly and that RLS can be applied
				token: `Bearer ${data.session.access_token}`,
			};
		}
		options.headers.set("apiKey", apiKey);

		return fetchUtils.fetchJson(url, options);
	};
};
