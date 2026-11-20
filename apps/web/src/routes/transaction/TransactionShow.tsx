import { NIS_ID } from "@piga/db/schema";
import type { Transaction } from "@piga/db/types";
import { Minus, Plus } from "lucide-react";
import { WithRecord } from "ra-core";

import { NumberField } from "#/components/admin/number-field";
import { RecordField } from "#/components/admin/record-field";
import { ReferenceField } from "#/components/admin/reference-field";
import { Show } from "#/components/admin/show";
import { Badge } from "#/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { toSmallDate, toTime } from "#/lib/format/toSmallDate";
import { ProfileFullName } from "#/routes/profile/ProfileFullName";

export function TransactionShow() {
	return (
		<Show>
			<WithRecord<Transaction>
				render={(record) => {
					const isReceived = Number(record.amount) > 0;

					return (
						<div className="mx-auto flex max-w-4xl flex-col gap-6">
							<Card>
								<CardHeader className="gap-4">
									<Badge variant={isReceived ? "received" : "spent"}>
										{isReceived ? <Plus /> : <Minus />}
										{isReceived ? "Received" : "Spent"}
									</Badge>
									<div className="flex flex-wrap items-baseline gap-3">
										<span className="text-4xl font-semibold tracking-tight tabular-nums sm:text-5xl">
											{new Intl.NumberFormat(undefined, {
												minimumFractionDigits: 2,
												maximumFractionDigits: 2,
											}).format(Math.abs(Number(record.amount)))}
										</span>
										<ReferenceField
											source="currency_id"
											reference="currency"
											link={false}
											empty="Unknown currency"
											render={({ referenceRecord }) => (
												<span className="text-lg text-muted-foreground">
													{referenceRecord?.symbol} {referenceRecord?.iso_code}
												</span>
											)}
										/>
									</div>
									{record.currency_id !== NIS_ID &&
									record.amount_nis != null ? (
										<p className="text-sm text-muted-foreground">
											Equivalent to{" "}
											<NumberField
												source="amount_nis"
												transform={(value) => Math.abs(Number(value))}
												options={{ style: "currency", currency: "ILS" }}
											/>
										</p>
									) : null}
									<time
										dateTime={new Date(record.transaction_at).toISOString()}
										className="text-sm text-muted-foreground"
									>
										{`${toSmallDate(record.transaction_at)} - ${toTime(record.transaction_at)}`}
									</time>
								</CardHeader>
								<CardContent className="border-t pt-6">
									<RecordField
										source="description"
										empty="No description"
										className="gap-2 whitespace-pre-wrap wrap-break-word"
									/>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Transaction details</CardTitle>
								</CardHeader>
								<CardContent className="grid grid-cols-1 gap-6 sm:grid-cols-2">
									<RecordField label="Type" className="gap-1">
										<ReferenceField
											source="transaction_type_id"
											reference="transaction_type"
											link={false}
											empty="—"
										/>
									</RecordField>
									<RecordField label="Owner" className="gap-1">
										<ProfileFullName />
									</RecordField>
									{[
										{
											source: "category_id",
											reference: "transaction_category",
											label: "Category",
										},
										{
											source: "sub_category_id",
											reference: "transaction_category",
											label: "Subcategory",
										},
										{
											source: "project_id",
											reference: "transaction_project",
											label: "Project",
										},
									].map(({ source, reference, label }) => (
										<RecordField key={source} label={label} className="gap-1">
											<ReferenceField
												source={source}
												reference={reference}
												link={false}
												empty="Not assigned"
												render={({ referenceRecord }) => referenceRecord?.value}
											/>
										</RecordField>
									))}
								</CardContent>
							</Card>
						</div>
					);
				}}
			/>
		</Show>
	);
}
