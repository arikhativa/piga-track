import { Check, ChevronsUpDown, Plus, X } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
	Command,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

type DynamicSelectProps = {
	choices: any[];
	value?: string | number | null;
	onChange: (value: string | number | null) => void;
	optionText?: string | ((record: any) => ReactNode);
	emptyText?: string;
	isPending?: boolean;
	onCreate?: (value: string) => Promise<string | number>;
	disabled?: boolean;
	className?: string;
};

const HISTORY_KEY = "__dynamicSelectDialog";

export function DynamicSelect({
	choices,
	className,
	value,
	onChange,
	optionText = "name",
	emptyText = "",
	isPending = false,
	onCreate,
	disabled = false,
}: DynamicSelectProps) {
	const [open, setOpen] = useState(false);
	const [search, setSearch] = useState("");
	const hasHistoryEntry = useRef(false);

	const getChoiceText = (choice: any) =>
		typeof optionText === "function" ? optionText(choice) : choice[optionText];

	const getChoiceValue = (choice: any) => choice.id;

	const selectedChoice = choices.find(
		(choice) => String(getChoiceValue(choice)) === String(value),
	);

	const filteredChoices = search
		? choices.filter((choice) =>
				String(getChoiceText(choice))
					.toLowerCase()
					.includes(search.toLowerCase()),
			)
		: choices;

	const hasExactMatch = filteredChoices.some(
		(choice) =>
			String(getChoiceText(choice)).toLowerCase() ===
			search.trim().toLowerCase(),
	);

	useEffect(() => {
		const handlePopState = () => {
			if (!hasHistoryEntry.current) return;

			hasHistoryEntry.current = false;
			setOpen(false);
			setSearch("");
		};

		window.addEventListener("popstate", handlePopState);
		return () => window.removeEventListener("popstate", handlePopState);
	}, []);

	const openDialog = () => {
		if (disabled || isPending || open) return;

		window.history.pushState(
			{ ...window.history.state, [HISTORY_KEY]: true },
			"",
			window.location.href,
		);

		hasHistoryEntry.current = true;
		setOpen(true);
	};

	const closeDialog = (goBack = true) => {
		setOpen(false);
		setSearch("");

		if (goBack && hasHistoryEntry.current) {
			hasHistoryEntry.current = false;
			window.history.back();
		}
	};

	const handleOpenChange = (nextOpen: boolean) => {
		if (nextOpen) {
			openDialog();
		} else {
			closeDialog();
		}
	};

	const handleSelect = (choice: any) => {
		closeDialog(false);
		onChange(getChoiceValue(choice));
	};

	const handleCreate = async () => {
		const newValue = search.trim();
		if (!newValue || !onCreate) return;

		const id = await onCreate(newValue);

		closeDialog(false);
		onChange(id);
	};

	const handleClear = () => {
		if (disabled || isPending) return;
		onChange(null);
	};

	return (
		<div className={cn("flex w-full min-w-0 items-center gap-4 ", className)}>
			<Button
				type="button"
				variant="ghost"
				role="combobox"
				aria-expanded={open}
				onClick={openDialog}
				disabled={disabled || isPending}
				className={cn(
					"h-9 min-w-0 flex-1 justify-between dark:bg-input/30 dark:hover:bg-input/50",
					"rounded-md border border-input bg-transparent",
					"px-2.5 py-2 text-sm font-normal whitespace-nowrap",
					"shadow-xs transition-[color,box-shadow]",
					"outline-none hover:bg-input/50",
					"focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
					"disabled:cursor-not-allowed disabled:opacity-50",
				)}
			>
				<span
					className={cn("truncate", !selectedChoice && "text-muted-foreground")}
				>
					{selectedChoice ? getChoiceText(selectedChoice) : emptyText}
				</span>

				<ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
			</Button>

			{selectedChoice && (
				// biome-ignore lint/a11y/useFocusableInteractive: we want to match the input select css
				// biome-ignore lint/a11y/useKeyWithClickEvents:  we want to match the input select css
				// biome-ignore lint/a11y/useSemanticElements:  we want to match the input select css
				<div
					role="button"
					className="p-0 ml-auto pointer-events-auto hover:bg-transparent text-muted-foreground opacity-50 hover:opacity-100"
					onClick={handleClear}
				>
					<X className="h-4 w-4" />
				</div>
			)}

			<CommandDialog
				open={open}
				onOpenChange={handleOpenChange}
				className="top-4 translate-y-0 sm:top-[50%] sm:translate-y-[-50%]"
			>
				<Command shouldFilter={false}>
					<CommandInput
						placeholder="Search or create..."
						value={search}
						onValueChange={setSearch}
					/>

					<CommandList>
						{filteredChoices.length === 0 && !search && (
							<CommandEmpty>No options found.</CommandEmpty>
						)}

						<CommandGroup>
							{filteredChoices.map((choice) => {
								const choiceValue = getChoiceValue(choice);
								const selected = String(choiceValue) === String(value);

								return (
									<CommandItem
										key={choiceValue}
										value={String(choiceValue)}
										onSelect={() => handleSelect(choice)}
									>
										<Check
											className={cn(
												"mr-2 size-4",
												selected ? "opacity-100" : "opacity-0",
											)}
										/>
										{getChoiceText(choice)}
									</CommandItem>
								);
							})}

							{search.trim() && !hasExactMatch && onCreate && (
								<CommandItem onSelect={handleCreate}>
									<Plus className="mr-2 size-4" />
									Create "{search.trim()}"
								</CommandItem>
							)}
						</CommandGroup>
					</CommandList>
				</Command>
			</CommandDialog>
		</div>
	);
}
