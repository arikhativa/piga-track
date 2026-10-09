import type { PropsWithChildren } from "react";

type DashboardSectionProps = PropsWithChildren<{
	title: string;
}>;

export function DashboardSection({ title, children }: DashboardSectionProps) {
	return (
		<section className="pt-4 flex flex-col gap-4">
			<h2 className="font-semibold text-2xl">{title}</h2>
			{children}
		</section>
	);
}
