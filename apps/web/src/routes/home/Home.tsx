import { FunctionsHttpError } from "@supabase/supabase-js";
import { LayoutDashboard, Plus, RefreshCw } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import GlareHover from "#/components/GlareHover";
import PixelIcon from "#/components/icon/lord-pigafetta";
import { Card, CardContent } from "#/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabaseClient } from "@/lib/supabaseClient";

export function Home() {
	const [isScraping, setIsScraping] = useState(false);
	const [scrapeStatus, setScrapeStatus] = useState<string | null>(null);

	async function testScrape() {
		if (isScraping) return;
		setIsScraping(true);
		setScrapeStatus("Testing Max scrape…");
		console.info("[scrape-transactions] Testing October 1–31, 2026.");

		try {
			const { data, error } = await supabaseClient.functions.invoke(
				"scrape-transactions",
				{ body: {} },
			);
			if (error) {
				if (error instanceof FunctionsHttpError) {
					const details = await error.context.json().catch(() => null);
					console.error("[scrape-transactions] Server error:", details);
					throw new Error(details?.error ?? error.message);
				}
				throw error;
			}
			console.info("[scrape-transactions] Logs:", data?.logs);
			if (!data?.success) {
				throw new Error(
					data?.error ?? "Scrape returned an unexpected response.",
				);
			}
			console.log("[scrape-transactions] Full Max result:", data.result);
			setScrapeStatus(
				"Scrape succeeded. Full result is in the browser console.",
			);
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Scrape request failed.";
			console.error("[scrape-transactions]", message);
			setScrapeStatus(message);
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
				<Button onClick={testScrape} disabled={isScraping}>
					<RefreshCw className={isScraping ? "animate-spin" : undefined} />
					<span>{isScraping ? "Testing Max…" : "Test Max Scrape"}</span>
				</Button>
			</div>
			{scrapeStatus && (
				<output className="mt-4 px-6 text-center text-sm text-muted-foreground">
					{scrapeStatus}
				</output>
			)}

			<div className="flex-1" />
		</div>
	);
}
