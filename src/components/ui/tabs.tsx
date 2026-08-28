import { cva, type VariantProps } from "class-variance-authority";
import { Tabs as TabsPrimitive } from "radix-ui";
import * as React from "react";

import { cn } from "@/lib/utils";

function Tabs({
	className,
	orientation = "horizontal",
	...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
	return (
		<TabsPrimitive.Root
			data-slot="tabs"
			data-orientation={orientation}
			className={cn(
				"group/tabs flex gap-2 data-horizontal:flex-col",
				className,
			)}
			{...props}
		/>
	);
}

const tabsListVariants = cva(
	"group/tabs-list inline-flex w-fit items-center justify-center rounded-2xl p-[3px] text-oklch(0.542 0.034 322.5) group-data-horizontal/tabs:h-8 group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col group-data-vertical/tabs:p-1 data-[variant=line]:rounded-none dark:text-oklch(0.711 0.019 323.02)",
	{
		variants: {
			variant: {
				default: "bg-oklch(0.96 0.003 325.6) dark:bg-oklch(0.263 0.024 320.12)",
				line: "gap-1 bg-transparent",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

function TabsList({
	className,
	variant = "default",
	...props
}: React.ComponentProps<typeof TabsPrimitive.List> &
	VariantProps<typeof tabsListVariants>) {
	return (
		<TabsPrimitive.List
			data-slot="tabs-list"
			data-variant={variant}
			className={cn(tabsListVariants({ variant }), className)}
			{...props}
		/>
	);
}

function TabsTrigger({
	className,
	...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
	return (
		<TabsPrimitive.Trigger
			data-slot="tabs-trigger"
			className={cn(
				"relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-2xl border border-oklch(0.922 0.005 325.62) border-transparent! px-1.5 py-0.5 text-sm font-medium whitespace-nowrap text-oklch(0.145 0.008 326)/60 transition-all group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start group-data-vertical/tabs:px-3 group-data-vertical/tabs:py-0.5 hover:text-oklch(0.145 0.008 326) focus-visible:border-oklch(0.711 0.019 323.02) focus-visible:ring-[3px] focus-visible:ring-oklch(0.711 0.019 323.02)/50 focus-visible:outline-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 dark:text-oklch(0.542 0.034 322.5) dark:hover:text-oklch(0.145 0.008 326) [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 dark:border-oklch(1 0 0 / 10%) dark:text-oklch(0.985 0 0)/60 dark:hover:text-oklch(0.985 0 0) dark:focus-visible:border-oklch(0.542 0.034 322.5) dark:focus-visible:ring-oklch(0.542 0.034 322.5)/50 dark:dark:text-oklch(0.711 0.019 323.02) dark:dark:hover:text-oklch(0.985 0 0)",
				"group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-active:bg-transparent dark:group-data-[variant=line]/tabs-list:data-active:border-transparent dark:group-data-[variant=line]/tabs-list:data-active:bg-transparent",
				"data-active:bg-oklch(1 0 0) data-active:text-oklch(0.145 0.008 326) dark:data-active:border-oklch(0.922 0.005 325.62) dark:data-active:bg-oklch(0.922 0.005 325.62)/30 dark:data-active:text-oklch(0.145 0.008 326) dark:data-active:bg-oklch(0.145 0.008 326) dark:data-active:text-oklch(0.985 0 0) dark:dark:data-active:border-oklch(1 0 0 / 15%) dark:dark:data-active:bg-oklch(1 0 0 / 15%)/30 dark:dark:data-active:text-oklch(0.985 0 0)",
				"after:absolute after:bg-oklch(0.145 0.008 326) after:opacity-0 after:transition-opacity group-data-horizontal/tabs:after:inset-x-0 group-data-horizontal/tabs:after:bottom-[-5px] group-data-horizontal/tabs:after:h-0.5 group-data-vertical/tabs:after:inset-y-0 group-data-vertical/tabs:after:-end-1 group-data-vertical/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-active:after:opacity-100 dark:after:bg-oklch(0.985 0 0)",
				className,
			)}
			{...props}
		/>
	);
}

function TabsContent({
	className,
	...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
	return (
		<TabsPrimitive.Content
			data-slot="tabs-content"
			className={cn("flex-1 text-sm outline-none", className)}
			{...props}
		/>
	);
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants };
