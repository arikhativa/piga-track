import type { PropsWithChildren } from "react";
import { Item, ItemContent, ItemDescription } from "@/components/ui/item";

export function ImportRowDescription({ children }: PropsWithChildren) {
	return (
		<Item className=" bg-accent">
			<ItemContent>
				<ItemDescription className="text-inherit text-center">
					{children}
				</ItemDescription>
			</ItemContent>
		</Item>
	);
}
