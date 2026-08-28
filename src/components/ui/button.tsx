import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import type * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"group/button inline-flex shrink-0 items-center justify-center rounded-2xl border border-oklch(0.922 0.005 325.62) border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-oklch(0.711 0.019 323.02) focus-visible:ring-3 focus-visible:ring-oklch(0.711 0.019 323.02)/30 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-oklch(0.577 0.245 27.325) aria-invalid:ring-3 aria-invalid:ring-oklch(0.577 0.245 27.325)/20 dark:aria-invalid:border-oklch(0.577 0.245 27.325)/50 dark:aria-invalid:ring-oklch(0.577 0.245 27.325)/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 dark:border-oklch(1 0 0 / 10%) dark:focus-visible:border-oklch(0.542 0.034 322.5) dark:focus-visible:ring-oklch(0.542 0.034 322.5)/30 dark:aria-invalid:border-oklch(0.704 0.191 22.216) dark:aria-invalid:ring-oklch(0.704 0.191 22.216)/20 dark:dark:aria-invalid:border-oklch(0.704 0.191 22.216)/50 dark:dark:aria-invalid:ring-oklch(0.704 0.191 22.216)/40",
	{
		variants: {
			variant: {
				default:
					"bg-oklch(0.212 0.019 322.12) text-oklch(0.985 0 0) hover:bg-oklch(0.212 0.019 322.12)/80 dark:bg-oklch(0.922 0.005 325.62) dark:text-oklch(0.212 0.019 322.12) dark:hover:bg-oklch(0.922 0.005 325.62)/80",
				outline:
					"border-oklch(0.922 0.005 325.62) bg-oklch(1 0 0) hover:bg-oklch(0.96 0.003 325.6) hover:text-oklch(0.145 0.008 326) aria-expanded:bg-oklch(0.96 0.003 325.6) aria-expanded:text-oklch(0.145 0.008 326) dark:bg-transparent dark:hover:bg-oklch(0.922 0.005 325.62)/30 dark:border-oklch(1 0 0 / 10%) dark:bg-oklch(0.145 0.008 326) dark:hover:bg-oklch(0.263 0.024 320.12) dark:hover:text-oklch(0.985 0 0) dark:aria-expanded:bg-oklch(0.263 0.024 320.12) dark:aria-expanded:text-oklch(0.985 0 0) dark:dark:hover:bg-oklch(1 0 0 / 15%)/30",
				secondary:
					"bg-oklch(0.96 0.003 325.6) text-oklch(0.212 0.019 322.12) hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-oklch(0.96 0.003 325.6) aria-expanded:text-oklch(0.212 0.019 322.12) dark:bg-oklch(0.263 0.024 320.12) dark:text-oklch(0.985 0 0) dark:aria-expanded:bg-oklch(0.263 0.024 320.12) dark:aria-expanded:text-oklch(0.985 0 0)",
				ghost:
					"hover:bg-oklch(0.96 0.003 325.6) hover:text-oklch(0.145 0.008 326) aria-expanded:bg-oklch(0.96 0.003 325.6) aria-expanded:text-oklch(0.145 0.008 326) dark:hover:bg-oklch(0.96 0.003 325.6)/50 dark:hover:bg-oklch(0.263 0.024 320.12) dark:hover:text-oklch(0.985 0 0) dark:aria-expanded:bg-oklch(0.263 0.024 320.12) dark:aria-expanded:text-oklch(0.985 0 0) dark:dark:hover:bg-oklch(0.263 0.024 320.12)/50",
				destructive:
					"bg-oklch(0.577 0.245 27.325)/10 text-oklch(0.577 0.245 27.325) hover:bg-oklch(0.577 0.245 27.325)/20 focus-visible:border-oklch(0.577 0.245 27.325)/40 focus-visible:ring-oklch(0.577 0.245 27.325)/20 dark:bg-oklch(0.577 0.245 27.325)/20 dark:hover:bg-oklch(0.577 0.245 27.325)/30 dark:focus-visible:ring-oklch(0.577 0.245 27.325)/40 dark:bg-oklch(0.704 0.191 22.216)/10 dark:text-oklch(0.704 0.191 22.216) dark:hover:bg-oklch(0.704 0.191 22.216)/20 dark:focus-visible:border-oklch(0.704 0.191 22.216)/40 dark:focus-visible:ring-oklch(0.704 0.191 22.216)/20 dark:dark:bg-oklch(0.704 0.191 22.216)/20 dark:dark:hover:bg-oklch(0.704 0.191 22.216)/30 dark:dark:focus-visible:ring-oklch(0.704 0.191 22.216)/40",
				link: "text-oklch(0.212 0.019 322.12) underline-offset-4 hover:underline dark:text-oklch(0.922 0.005 325.62)",
			},
			size: {
				default:
					"h-8 gap-1.5 px-3 has-data-[icon=inline-end]:pe-2.5 has-data-[icon=inline-start]:ps-2.5",
				xs: "h-6 gap-1 px-2.5 text-xs has-data-[icon=inline-end]:pe-2 has-data-[icon=inline-start]:ps-2 [&_svg:not([class*='size-'])]:size-3",
				sm: "h-7 gap-1 px-3 has-data-[icon=inline-end]:pe-2 has-data-[icon=inline-start]:ps-2",
				lg: "h-9 gap-1.5 px-4 has-data-[icon=inline-end]:pe-3 has-data-[icon=inline-start]:ps-3",
				icon: "size-8",
				"icon-xs": "size-6 [&_svg:not([class*='size-'])]:size-3",
				"icon-sm": "size-7",
				"icon-lg": "size-9",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

function Button({
	className,
	variant = "default",
	size = "default",
	asChild = false,
	...props
}: React.ComponentProps<"button"> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean;
	}) {
	const Comp = asChild ? Slot.Root : "button";

	return (
		<Comp
			data-slot="button"
			data-variant={variant}
			data-size={size}
			className={cn(buttonVariants({ variant, size, className }))}
			{...props}
		/>
	);
}

export { Button, buttonVariants };
