import { useNotify, useRefresh } from "ra-core";
import { type SubmitEvent, useId, useState } from "react";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { updateAutoSyncCredentials } from "#/lib/updateAutoSyncCredentials";

// TODO this mighit niot be good
export const AutoSyncCredentialsForm = ({
	configured,
}: {
	configured: boolean;
}) => {
	const passwordId = useId();
	const [pending, setPending] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const notify = useNotify();
	const refresh = useRefresh();

	const saveCredentials = async (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (pending) return;
		const form = event.currentTarget;
		const password = new FormData(form).get("password");
		if (typeof password !== "string") return;
		if (!configured && !password.trim()) {
			setError("Enter a password to configure credentials for the first time.");
			return;
		}
		setPending(true);
		setError(null);
		try {
			await updateAutoSyncCredentials(password);
			form.reset();
			notify("Credentials saved.", { type: "success" });
			refresh();
		} catch {
			setError("Unable to save credentials. Check your session and try again.");
		} finally {
			setPending(false);
		}
	};

	return (
		<form
			className="mt-8 flex max-w-lg flex-col gap-4"
			onSubmit={saveCredentials}
		>
			<h3 className="text-lg font-semibold">MAX credentials</h3>
			<p className="text-sm text-muted-foreground">
				Credentials: {configured ? "Configured" : "Not configured"}. Stored
				credentials are never displayed. Saving does not enable the source or
				verify the MAX login.
			</p>
			<Label htmlFor={passwordId}>MAX password</Label>
			<Input
				id={passwordId}
				name="password"
				type="password"
				autoComplete="new-password"
				disabled={pending}
				aria-describedby={`${passwordId}-help`}
			/>
			<p id={`${passwordId}-help`} className="text-sm text-muted-foreground">
				Leave blank to keep the existing password. Save public settings
				separately.
			</p>
			{error && (
				<p role="alert" className="text-sm text-destructive">
					{error}
				</p>
			)}
			<Button type="submit" disabled={pending}>
				{pending ? "Saving credentials…" : "Save credentials"}
			</Button>
		</form>
	);
};
