import type { GetListParams } from "ra-core";

export const categoryListParams = {
	pagination: { page: 1, perPage: 1000 },
	sort: { field: "value", order: "ASC" },
	filter: {},
} satisfies GetListParams;

export const categoryListStaleTime = 60_000;

export const categoryListQueryKey = (meta?: GetListParams["meta"]) => [
	"transaction_category",
	"getList",
	{ ...categoryListParams, meta },
];
