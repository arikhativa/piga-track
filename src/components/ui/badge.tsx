import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
	"inline-flex items-center justify-center rounded-md border border-oklch(0.922 0.005 325.62) px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-oklch(0.711 0.019 323.02) focus-visible:ring-oklch(0.711 0.019 323.02)/50 focus-visible:ring-[3px] aria-invalid:ring-oklch(0.577 0.245 27.325)/20 dark:aria-invalid:ring-oklch(0.577 0.245 27.325)/40 aria-invalid:border-oklch(0.577 0.245 27.325) transition-[color,box-shadow] overflow-hidden dark:border-oklch(1 0 0 / 10%) dark:focus-visible:border-oklch(0.542 0.034 322.5) dark:focus-visible:ring-oklch(0.542 0.034 322.5)/50 dark:aria-invalid:ring-oklch(0.704 0.191 22.216)/20 dark:dark:aria-invalid:ring-oklch(0.704 0.191 22.216)/40 dark:aria-invalid:border-oklch(0.704 0.191 22.216)",
	{
		variants: {
			variant: {
				default:
					"border-transparent bg-oklch(0.212 0.019 322.12) text-oklch(0.985 0 0) [a&]:hover:bg-oklch(0.212 0.019 322.12)/90 dark:bg-oklch(0.922 0.005 325.62) dark:text-oklch(0.212 0.019 322.12) dark:[a&]:hover:bg-oklch(0.922 0.005 325.62)/90",
				secondary:
					"border-transparent bg-oklch(0.96 0.003 325.6) text-oklch(0.212 0.019 322.12) [a&]:hover:bg-oklch(0.96 0.003 325.6)/90 dark:bg-oklch(0.263 0.024 320.12) dark:text-oklch(0.985 0 0) dark:[a&]:hover:bg-oklch(0.263 0.024 320.12)/90",
				destructive:
					"border-transparent bg-oklch(0.577 0.245 27.325) text-white [a&]:hover:bg-oklch(0.577 0.245 27.325)/90 focus-visible:ring-oklch(0.577 0.245 27.325)/20 dark:focus-visible:ring-oklch(0.577 0.245 27.325)/40 dark:bg-oklch(0.577 0.245 27.325)/60 dark:bg-oklch(0.704 0.191 22.216) dark:[a&]:hover:bg-oklch(0.704 0.191 22.216)/90 dark:focus-visible:ring-oklch(0.704 0.191 22.216)/20 dark:dark:focus-visible:ring-oklch(0.704 0.191 22.216)/40 dark:dark:bg-oklch(0.704 0.191 22.216)/60",
				outline:
					"text-oklch(0.145 0.008 326) [a&]:hover:bg-oklch(0.96 0.003 325.6) [a&]:hover:text-oklch(0.212 0.019 322.12) dark:text-oklch(0.985 0 0) dark:[a&]:hover:bg-oklch(0.263 0.024 320.12) dark:[a&]:hover:text-oklch(0.985 0 0)",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

function Badge({
	className,
	variant,
	asChild = false,
	...props
}: React.ComponentProps<"span"> &
	VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
	const Comp = asChild ? Slot : "span";

	return (
		<Comp
			data-slot="badge"
			className={cn(badgeVariants({ variant }), className)}
			{...props}
		/>
	);
}

export { Badge, badgeVariants };
