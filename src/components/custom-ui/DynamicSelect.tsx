import { Check, ChevronsUpDown, Plus } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";

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
	onChange: (value: string | number) => void;
	optionText?: string | ((record: any) => ReactNode);
	emptyText?: string;
	isPending?: boolean;
	onCreate?: (value: string) => Promise<string | number>;
	disabled?: boolean;
	className?: string;
};

export function DynamicSelect({
	choices,
	className,
	value,
	onChange,
	optionText = "name",
	emptyText = "Select...",
	isPending = false,
	onCreate,
	disabled = false,
}: DynamicSelectProps) {
	const [open, setOpen] = useState(false);
	const [search, setSearch] = useState("");

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
			String(getChoiceText(choice)).toLowerCase() === search.toLowerCase(),
	);

	const handleSelect = (choice: any) => {
		onChange(getChoiceValue(choice));
		setSearch("");
		setOpen(false);
	};

	const handleCreate = async () => {
		const newValue = search.trim();
		if (!newValue || !onCreate) return;

		const id = await onCreate(newValue);

		onChange(id);
		setSearch("");
		setOpen(false);
	};

	return (
		<div className={className}>
			<Button
				type="button"
				variant="ghost"
				role="combobox"
				aria-expanded={open}
				onClick={() => setOpen(true)}
				className={cn(
					"h-9 w-full min-w-0 justify-between",
					"rounded-md border border-input bg-transparent",
					"px-2.5 py-2 text-sm font-normal whitespace-nowrap",
					"shadow-xs transition-[color,box-shadow]",
					"outline-none",
					"hover:bg-input/50",
					"focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
					"disabled:cursor-not-allowed disabled:opacity-50",
				)}
				disabled={disabled || isPending}
			>
				<span className={cn(!selectedChoice && "text-muted-foreground")}>
					{selectedChoice ? getChoiceText(selectedChoice) : emptyText}
				</span>

				<ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
			</Button>

			<CommandDialog
				open={open}
				onOpenChange={setOpen}
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
									Create "{search}"
								</CommandItem>
							)}
						</CommandGroup>
					</CommandList>
				</Command>
			</CommandDialog>
		</div>
	);
}
