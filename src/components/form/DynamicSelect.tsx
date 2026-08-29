import { Check, ChevronsUpDown, Plus } from "lucide-react";
import type { ChoicesProps, InputProps } from "ra-core";
import {
	FieldTitle,
	useChoices,
	useChoicesContext,
	useCreate,
	useInput,
} from "ra-core";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";

import { FormError, FormField, FormLabel } from "@/components/admin/form";
import { InputHelperText } from "@/components/admin/input-helper-text";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type DynamicSelectProps = ChoicesProps &
	Partial<InputProps> & {
		label?: string;
		optionText?: string | ((record: any) => ReactNode);
		emptyText?: string;
	};

export function DynamicSelect({
	optionText = "name",
	emptyText = "Select...",
	label,
	helperText,
	...props
}: DynamicSelectProps) {
	const { allChoices = [], isPending, source, resource } = useChoicesContext();

	const { id, field, isRequired } = useInput({
		...props,
		source,
		resource,
		label,
		helperText,
	});

	const [open, setOpen] = useState(false);
	const [search, setSearch] = useState("");

	const { getChoiceText, getChoiceValue } = useChoices({
		optionText,
	});

	const [create] = useCreate();

	const selectedChoice = allChoices.find(
		(choice) => String(getChoiceValue(choice)) === String(field.value),
	);

	const filteredChoices = useMemo(() => {
		if (!search) return allChoices;

		return allChoices.filter((choice) =>
			String(getChoiceText(choice))
				.toLowerCase()
				.includes(search.toLowerCase()),
		);
	}, [allChoices, getChoiceText, search]);

	const hasExactMatch = filteredChoices.some(
		(choice) =>
			String(getChoiceText(choice)).toLowerCase() === search.toLowerCase(),
	);

	const handleSelect = (choice: any) => {
		field.onChange(getChoiceValue(choice));
		setSearch("");
		setOpen(false);
	};

	const handleCreate = async () => {
		const value = search.trim();
		if (!value) return;

		const record = await create(
			resource,
			{
				data: {
					value,
				},
			},
			{
				returnPromise: true,
			},
		);

		field.onChange(record.id);

		setSearch("");
		setOpen(false);
	};

	return (
		<FormField id={id} name={field.name} className="w-full min-w-20">
			{label !== "" && (
				<FormLabel>
					<FieldTitle
						label={label}
						source={source}
						resource={resource}
						isRequired={isRequired}
					/>
				</FormLabel>
			)}

			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						type="button"
						variant="ghost"
						role="combobox"
						aria-expanded={open}
						className={cn(
							"justify-between h-8 w-full min-w-0 rounded-2xl border border-transparent",
							"bg-input/50 px-2.5 py-1",
							"text-base font-normal transition-[color,box-shadow] duration-200",
							"outline-none",
							"hover:bg-input/70",
							"focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30",
							"disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
							"md:text-sm",
						)}
						disabled={field.disabled || isPending}
					>
						<span className={cn(!selectedChoice && "text-muted-foreground")}>
							{selectedChoice ? getChoiceText(selectedChoice) : emptyText}
						</span>

						<ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
					</Button>
				</PopoverTrigger>

				<PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
					<Command shouldFilter={false}>
						<CommandInput
							placeholder="Search or create..."
							value={search}
							onValueChange={setSearch}
						/>

						<CommandList>
							{filteredChoices.length === 0 && !search && (
								<CommandEmpty>No tags found.</CommandEmpty>
							)}

							<CommandGroup>
								{filteredChoices.map((choice) => {
									const value = getChoiceValue(choice);
									const selected = String(value) === String(field.value);

									return (
										<CommandItem
											key={value}
											value={String(value)}
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

								{search.trim() && !hasExactMatch && (
									<CommandItem onSelect={handleCreate}>
										<Plus className="mr-2 size-4" />
										Create "{search}"
									</CommandItem>
								)}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>

			<InputHelperText helperText={helperText} />
			<FormError />
		</FormField>
	);
}
