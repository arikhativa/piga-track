import { RefreshCw } from "lucide-react";
import { useNotify, useRefresh } from "ra-core";
import { useRef, useState } from "react";
import { Button } from "#/components/ui/button";
import { supabaseClient } from "#/lib/supabaseClient";

export const RunAutoSyncButton = () => {
	const [isSyncing, setIsSyncing] = useState(false);
	const pending = useRef(false);
	const notify = useNotify();
	const refresh = useRefresh();

	const runAutoSync = async () => {
		if (pending.current) return;
		pending.current = true;
		setIsSyncing(true);
		try {
			const { data, error } = await supabaseClient.functions.invoke(
				"scrape-transactions",
			);
			if (error || !Array.isArray(data?.sources)) {
				throw new Error("Auto-sync failed");
			}
			notify("Auto-sync completed.", { type: "success" });
			refresh();
		} catch {
			notify(
				"Auto-sync failed. Some review rows may have been written. Please try again.",
				{ type: "error" },
			);
		} finally {
			pending.current = false;
			setIsSyncing(false);
		}
	};

	return (
		<Button onClick={runAutoSync} disabled={isSyncing}>
			<RefreshCw className={isSyncing ? "animate-spin" : undefined} />
			<span>{isSyncing ? "Syncing…" : "Run auto-sync"}</span>
		</Button>
	);
};
