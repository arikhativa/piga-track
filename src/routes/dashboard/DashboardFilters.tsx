import { useMemo } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

type DateRange = {
	from: Date;
	to: Date;
};

type DashboardFiltersProps = {
	value: DateRange;
	onChange: (range: DateRange) => void;
};

type Preset = {
	value: string;
	label: string;
	from: Date;
	to: Date;
};

const getMonthRange = (year: number, month: number) => ({
	from: new Date(year, month - 1, 1, 0, 0, 0, 0),
	to: new Date(year, month, 0, 23, 59, 59, 999),
});

const getPresets = (): Preset[] => {
	const now = new Date();

	return Array.from({ length: 7 }, (_, index) => {
		const monthOffset = index - 6;

		const date = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);

		const range = getMonthRange(date.getFullYear(), date.getMonth() + 1);

		return {
			value: `${date.getFullYear()}-${date.getMonth() + 1}`,
			label: date.toLocaleDateString("en-GB", {
				month: "long",
				year: "numeric",
			}),
			from: range.from,
			to: range.to,
		};
	}).reverse();
};

const toDateKey = (date: Date) => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");

	return `${year}-${month}-${day}`;
};

const isSameRange = (a: DateRange, b: DateRange) =>
	toDateKey(a.from) === toDateKey(b.from) &&
	toDateKey(a.to) === toDateKey(b.to);

export function DashboardFilters({ value, onChange }: DashboardFiltersProps) {
	const presets = useMemo(() => getPresets(), []);

	const selectedPreset = presets.find((preset) =>
		isSameRange(value, {
			from: preset.from,
			to: preset.to,
		}),
	);

	const handlePresetChange = (presetValue: string | null) => {
		if (!presetValue) return;

		const preset = presets.find((item) => item.value === presetValue);

		if (!preset) return;

		onChange({
			from: preset.from,
			to: preset.to,
		});
	};

	return (
		<div className="flex items-center gap-3">
			<Select
				value={selectedPreset?.value ?? ""}
				onValueChange={handlePresetChange}
			>
				<SelectTrigger className="">
					<SelectValue placeholder="Select month">
						{selectedPreset?.label}
					</SelectValue>
				</SelectTrigger>

				<SelectContent>
					{presets.map((preset) => (
						<SelectItem key={preset.value} value={preset.value}>
							{preset.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}
