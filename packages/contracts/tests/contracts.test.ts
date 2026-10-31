import assert from "node:assert/strict";
import test from "node:test";
import { jsonResponse } from "../../../supabase/functions/_shared/helper.ts";
import {
	createImportBatchResponseSchema,
	createImportBatchSchema,
} from "../src/create-import-batch.ts";
import {
	dashboardRequestSchema,
	dashboardResponseSchema,
} from "../src/dashboard-data.ts";
import {
	type TransactionDataRequest,
	type TransactionDataRequestInput,
	transactionDataRequestSchema,
	transactionDataResponseSchema,
} from "../src/get-transaction-data.ts";
import {
	importRowActionResponseSchema,
	importRowActionSchema,
} from "../src/import-row-action.ts";

const timestamp = "2026-10-01T00:00:00.000Z";
const range = { from: timestamp, to: "2026-11-01T00:00:00.000Z" };
const row = {
	id: 1,
	import_batch_id: 2,
	row_number: 1,
	date: "2026-10-01",
	amount: "-12.30",
	description: null,
	tag_id: null,
	category_id: null,
	project_id: null,
	status: "pending",
	duplicate_transaction_id: null,
	transaction_id: null,
	created_at: timestamp,
	updated_at: timestamp,
};
const batch = {
	id: 2,
	import_profile_id: 3,
	batch_name: "October",
	status: "draft",
	created_at: timestamp,
	updated_at: timestamp,
};

test("HTTP serialization matches create and action success contracts", async () => {
	const databaseRow = {
		...row,
		date: null,
		created_at: new Date(timestamp),
		updated_at: new Date(timestamp),
	};
	const databaseBatch = {
		...batch,
		created_at: new Date(timestamp),
		updated_at: new Date(timestamp),
	};
	const created = jsonResponse({ batch: databaseBatch, rows: [databaseRow] }, 201);
	assert.equal(created.status, 201);
	assert.deepEqual(
		createImportBatchResponseSchema.parse(await created.json()),
		{
			batch,
			rows: [{ ...row, date: null }],
		},
	);
	for (const action of [
		"undo",
		"set_category",
		"set_project",
		"set_tag",
		"set_status",
	]) {
		// These actions return the original rows, not the updated records.
		const response = await jsonResponse({
			data: { action, rows: [databaseRow] },
		}).json();
		assert.deepEqual(importRowActionResponseSchema.parse(response), {
			data: { action, rows: [{ ...row, date: null }] },
		});
	}
	const merged = await jsonResponse({
		data: { action: "merge", rows: [{ id: 10 }] },
	}).json();
	assert.deepEqual(importRowActionResponseSchema.parse(merged), merged);
});

test("optional request fields do not become required or acquire new defaults", () => {
	const input = {
		batch_name: "October",
		import_profile_id: 3,
		rows: [
			{
				row_number: 1,
				date: null,
				amount: "0.00",
				description: null,
				tag_id: null,
				category_id: null,
				project_id: null,
			},
		],
	};
	assert.deepEqual(createImportBatchSchema.parse(input), input);
	assert.deepEqual(
		createImportBatchSchema.parse({ ...input, rows: [] }).rows,
		[],
	);
	assert.equal(
		createImportBatchSchema.safeParse({
			...input,
			rows: [{ row_number: 1, amount: "0.00" }],
		}).success,
		false,
	);
	const action = {
		profileId: "123e4567-e89b-42d3-a456-426614174000",
		import_row_ids: [],
		action: "set_tag",
	};
	assert.deepEqual(importRowActionSchema.parse(action), action);
	assert.equal(
		importRowActionSchema.safeParse({ ...action, value: false }).success,
		false,
	);
	const parsed = transactionDataRequestSchema.parse({
		dateRange: range,
		bucket: "none",
		category_list: undefined,
		tag_list: undefined,
		project_list: undefined,
	});
	assert.deepEqual(
		[parsed.category_list, parsed.tag_list, parsed.project_list],
		[[], [], []],
	);
	parsed.category_list.push(1);
	assert.deepEqual(
		transactionDataRequestSchema.parse({ dateRange: range, bucket: "none" })
			.category_list,
		[],
	);
	assert.deepEqual(createImportBatchResponseSchema.parse({ batch, rows: [] }), {
		batch,
		rows: [],
	});
	assert.deepEqual(
		importRowActionResponseSchema.parse({
			data: { action: "set_tag", rows: [] },
		}),
		{ data: { action: "set_tag", rows: [] } },
	);
});

test("dashboard validates dates and numeric success payloads", () => {
	assert.deepEqual(dashboardRequestSchema.parse(range), range);
	assert.equal(
		dashboardRequestSchema.safeParse({ ...range, from: "invalid" }).success,
		false,
	);
	const response = {
		balance: 87.7,
		income: 100,
		expenses: -12.3,
		incomeCategories: [{ categoryId: 1, category: "Salary", amount: 100 }],
		expenseCategories: [
			{ categoryId: 2, category: "Food", isBoth: true, amount: -12.3 },
		],
		monthly: [{ month: "2026-10", income: 100, expenses: -12.3 }],
	};
	assert.deepEqual(dashboardResponseSchema.parse(response), response);
	assert.equal(
		dashboardResponseSchema.safeParse({ ...response, balance: "87.70" }).success,
		false,
	);
});

test("transaction filters default on output, remain optional on input", () => {
	const input: TransactionDataRequestInput = { dateRange: range, bucket: "none" };
	const parsed: TransactionDataRequest = transactionDataRequestSchema.parse(input);
	assert.deepEqual(parsed, {
		...input,
		category_list: [],
		tag_list: [],
		project_list: [],
	});
	const explicit = {
		...input,
		bucket: "calendar_month",
		category_list: [1],
		tag_list: [2],
		project_list: [3],
	};
	assert.deepEqual(transactionDataRequestSchema.parse(explicit), explicit);
	for (const invalid of [
		{ ...input, bucket: "day" },
		{ ...input, tag_list: null },
		{ ...input, category_list: [1.5] },
		{ ...input, project_list: ["3"] },
	]) {
		assert.equal(transactionDataRequestSchema.safeParse(invalid).success, false);
	}
	const response = {
		total: -12.3,
		buckets: [{ bucket: "total", amount: -12.3, type: "expense" }],
	};
	assert.deepEqual(transactionDataResponseSchema.parse(response), response);
	assert.equal(
		transactionDataResponseSchema.safeParse({ ...response, total: "-12.30" })
			.success,
		false,
	);
});

test("create request preserves optional fields, nullable dates, and trimming", () => {
	const input = {
		batch_name: " October ",
		import_profile_id: 3,
		rows: [{ row_number: 1, date: null, amount: "12.30" }],
	};
	assert.deepEqual(createImportBatchSchema.parse(input), {
		...input,
		batch_name: "October",
	});
	assert.equal(
		createImportBatchSchema.safeParse({ ...input, batch_name: " " }).success,
		false,
	);
	assert.equal(
		createImportBatchSchema.safeParse({ ...input, import_profile_id: 0 }).success,
		false,
	);
	assert.equal(
		createImportBatchSchema.safeParse({
			...input,
			rows: [{ row_number: 0, date: null, amount: 12.3 }],
		}).success,
		false,
	);
});

test("create response requires unwrapped batch and serialized rows", () => {
	const response = { batch, rows: [row] };
	assert.deepEqual(createImportBatchResponseSchema.parse(response), response);
	assert.equal(
		createImportBatchResponseSchema.safeParse({ data: response }).success,
		false,
	);
	assert.equal(
		createImportBatchResponseSchema.safeParse({
			batch: { ...batch, created_at: new Date(timestamp) },
			rows: [row],
		}).success,
		false,
	);
	assert.equal(
		createImportBatchResponseSchema.safeParse({
			batch,
			rows: [{ ...row, amount: -12.3 }],
		}).success,
		false,
	);
	assert.equal(
		createImportBatchResponseSchema.safeParse({
			batch,
			rows: [{ ...row, transaction_id: undefined }],
		}).success,
		false,
	);
});

test("action requests retain optional values and all existing actions", () => {
	const input = {
		profileId: "123e4567-e89b-42d3-a456-426614174000",
		import_row_ids: [1],
	};
	for (const action of [
		"mergeAllPending",
		"merge",
		"undo",
		"set_category",
		"set_project",
		"set_tag",
		"set_status",
	]) {
		assert.equal(
			importRowActionSchema.safeParse({ ...input, action }).success,
			true,
		);
	}
	for (const value of [null, 1, "dropped"]) {
		assert.equal(
			importRowActionSchema.safeParse({ ...input, action: "set_status", value })
				.success,
			true,
		);
	}
	assert.equal(
		importRowActionSchema.safeParse({
			...input,
			action: "mergeAllPending",
			import_row_ids: [],
			value: 2,
		}).success,
		true,
	);
	assert.equal(
		importRowActionSchema.safeParse({
			...input,
			action: "merge",
			profileId: "invalid",
		}).success,
		false,
	);
	assert.equal(
		importRowActionSchema.safeParse({
			...input,
			action: "merge",
			import_row_ids: [-1],
		}).success,
		false,
	);
	assert.equal(
		importRowActionSchema.safeParse({ ...input, action: "unknown" }).success,
		false,
	);
});

test("action success distinguishes merge IDs from original serialized rows", () => {
	const merged = { data: { action: "merge", rows: [{ id: 10 }] } };
	assert.deepEqual(importRowActionResponseSchema.parse(merged), merged);
	for (const action of [
		"undo",
		"set_category",
		"set_project",
		"set_tag",
		"set_status",
	]) {
		const response = { data: { action, rows: [row] } };
		assert.deepEqual(importRowActionResponseSchema.parse(response), response);
		assert.equal(
			importRowActionResponseSchema.safeParse({
				data: { action, rows: [{ id: 1 }] },
			}).success,
			false,
		);
	}
	assert.equal(importRowActionResponseSchema.safeParse(merged.data).success, false);
	assert.equal(
		importRowActionResponseSchema.safeParse({
			data: { action: "mergeAllPending", rows: [{ id: 10 }] },
		}).success,
		false,
	);
	assert.equal(
		importRowActionResponseSchema.safeParse({
			data: {
				action: "undo",
				rows: [{ ...row, updated_at: new Date(timestamp) }],
			},
		}).success,
		false,
	);
});
