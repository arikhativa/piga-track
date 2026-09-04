import { Coins, PiggyBank } from "lucide-react";
import { Form, required, useLogin, useNotify } from "ra-core";
import { useState } from "react";
import type { FieldValues, SubmitHandler } from "react-hook-form";
import PixelIcon from "#/components/icon/lord pigafetta";
import { Notification } from "@/components/admin/notification";
import { TextInput } from "@/components/admin/text-input";
import { Button } from "@/components/ui/button";

/**
 * Login page displayed when authentication is enabled and the user is not authenticated.
 *
 * Automatically shown when an unauthenticated user tries to access a protected route.
 * Handles login via authProvider.login() and displays error notifications on failure.
 *
 * @see {@link https://marmelab.com/shadcn-admin-kit/docs/loginpage LoginPage documentation}
 * @see {@link https://marmelab.com/shadcn-admin-kit/docs/security Security documentation}
 */
export const LoginPage = (props: { redirectTo?: string }) => {
	const { redirectTo } = props;
	const [loading, setLoading] = useState(false);
	const login = useLogin();
	const notify = useNotify();

	const handleSubmit: SubmitHandler<FieldValues> = (values) => {
		setLoading(true);
		login(values, redirectTo)
			.then(() => {
				setLoading(false);
			})
			.catch((error) => {
				setLoading(false);
				notify(
					typeof error === "string"
						? error
						: typeof error === "undefined" || !error.message
							? "ra.auth.sign_in_error"
							: error.message,
					{
						type: "error",
						messageArgs: {
							_:
								typeof error === "string"
									? error
									: error && error.message
										? error.message
										: undefined,
						},
					},
				);
			});
	};

	return (
		<div className="min-h-screen flex">
			<div className="container relative grid flex-col items-center justify-center sm:max-w-none lg:grid-cols-2 lg:px-0">
				<div className="relative hidden h-full flex-col bg-oklch(0.96 0.003 325.6) p-10 text-white dark:border-e lg:flex dark:bg-oklch(0.263 0.024 320.12)">
					<div className="absolute inset-0 bg-zinc-900" />
					<div className="relative z-20 flex items-center text-lg font-medium">
						{/** biome-ignore lint/a11y/noSvgWithoutTitle: this is just a line */}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="me-2 h-6 w-6"
						>
							<path d="M15 6v12a3 3 0 1 3-3H6a3 3V6a3 0-3 3h12a3 0-3-3" />
						</svg>
						Lord Pigafetta
					</div>
					<div className="w-full z-20 ps-8 pt-2">
						<p className="">Helps you manage your money pots.</p>
					</div>
					<div className="w-full z-20 pt-10 ps-8">
						<p className="text-sm text-muted-foreground">
							(Lord knows you can't do it without him)
						</p>
					</div>
					<div className="w-full z-20 h-full  flex justify-center items-center">
						<PixelIcon className="size-60 h-full" />
					</div>
					<div className="relative z-20 mt-auto flex justify-center  items-center gap-16">
						<PiggyBank size={180} />
						<Coins size={82} />
					</div>
				</div>
				<div className="lg:p-8">
					<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
						<div className="flex flex-col space-y-2 text-center">
							<h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
							<p className="text-sm leading-none text-oklch(0.542 0.034 322.5) dark:text-oklch(0.711 0.019 323.02)">
								Try name@example.com / password
							</p>
						</div>
						<Form className="space-y-8" onSubmit={handleSubmit}>
							<TextInput
								label="Email"
								source="email"
								type="email"
								validate={required()}
							/>
							<TextInput
								label="Password"
								source="password"
								type="password"
								validate={required()}
							/>
							<Button
								type="submit"
								className="cursor-pointer"
								disabled={loading}
							>
								Sign in
							</Button>
						</Form>
					</div>
				</div>
			</div>
			<Notification />
		</div>
	);
};
