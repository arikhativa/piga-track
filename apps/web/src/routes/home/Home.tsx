import { FunctionsHttpError } from "@supabase/supabase-js";
import { LayoutDashboard, Plus, RefreshCw } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import GlareHover from "#/components/GlareHover";
import PixelIcon from "#/components/icon/lord-pigafetta";
import { Card, CardContent } from "#/components/ui/card";
import { Button } from "@/components/ui/button";

import { supabaseClient } from "@/lib/supabaseClient";

const scrapeCountLabels = [
	["sources", "Sources"],
	["disabledSources", "Disabled sources"],
	["fetched", "Fetched"],
	["inserted", "Inserted"],
	["existing", "Existing"],
	["changed", "Changed"],
	["invalid", "Invalid"],
	["pending", "Pending"],
	["dropped", "Dropped"],
	["duplicates", "Duplicates"],
] as const;

function formatScrapeCounts(counts: unknown): string {
	if (!counts || typeof counts !== "object") return "";

	const values = counts as Record<string, unknown>;
	return scrapeCountLabels
		.flatMap(([key, label]) => {
			const count = values[key];
			return typeof count === "number" &&
				Number.isSafeInteger(count) &&
				count >= 0
				? [`${label}: ${count}`]
				: [];
		})
		.join(" · ");
}

export function Home() {

	const [isScraping, setIsScraping] = useState(false);
	const [scrapeStatus, setScrapeStatus] = useState<string | null>(null);

	async function runAutoSync() {
		if (isScraping) return;
		setIsScraping(true);
		setScrapeStatus("Syncing…");

		try {
			const { data, error } = await supabaseClient.functions.invoke(
				"scrape-transactions",
			);
			let response: unknown = data;
			if (error instanceof FunctionsHttpError) {
				response = await error.context.json().catch(() => null);
			}

			const result =
				response && typeof response === "object"
					? (response as Record<string, unknown>)
					: null;
			const counts = formatScrapeCounts(result?.counts);

			if (!error && result?.skipped === "already_running") {
				setScrapeStatus(
					`Auto-sync skipped: another sync is already running.${counts ? ` ${counts}` : ""}`,
				);
			} else if (error || result?.success !== true) {
				setScrapeStatus(
					`Auto-sync failed. Some review rows may have been written.${counts ? ` Partial counts: ${counts}` : ""}`,
				);
			} else {
				setScrapeStatus(`Auto-sync completed.${counts ? ` ${counts}` : ""}`);
			}
		} catch {
			setScrapeStatus(
				"Auto-sync could not be completed. Some review rows may have been written. Please try again.",
			);
		} finally {
			setIsScraping(false);
		}
	}

	return (
		<div className="flex flex-col h-full">
			<div className="flex justify-center items-center flex-1">
				<Link to="/transaction/create">
					<GlareHover
						width="auto"
						height="auto"
						background="transparent"
						borderColor="transparent"
						borderRadius="0.5rem"
						glareColor="var(--glare-color)"
						glareOpacity={0.25}
						glareAngle={-30}
						glareSize={250}
						transitionDuration={800}
					>
						<Card className="bg-accent border-2">
							<CardContent>
								<PixelIcon className="size-40" />
							</CardContent>
						</Card>
					</GlareHover>
				</Link>
			</div>

			<div className="flex flex-col gap-4 md:flex-row md:justify-center md:items-center px-20 md:px-auto">
				<Button nativeButton={false} render={<Link to="/dashboard" />}>
					<LayoutDashboard />
					<span>Dashboard</span>
				</Button>
				<Button nativeButton={false} render={<Link to="/transaction/create" />}>
					<Plus />
					<span>New Transaction</span>
				</Button>
				<Button onClick={runAutoSync} disabled={isScraping}>
					<RefreshCw className={isScraping ? "animate-spin" : undefined} />
					<span>{isScraping ? "Syncing…" : "Run auto-sync"}</span>
				</Button>
			</div>
			<p className="mt-4 px-6 text-center text-sm text-muted-foreground">
				Auto-sync honors enabled settings and writes review rows. It does not
				create transactions.
			</p>
			{scrapeStatus && (
				<output className="mt-4 px-6 text-center text-sm text-muted-foreground">
					{scrapeStatus}
				</output>
			)}

			<div className="flex-1" />
		</div>
	);
}
