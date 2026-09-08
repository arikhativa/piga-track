import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import PixelIcon from "#/components/icon/lord pigafetta";
import { Card, CardContent } from "#/components/ui/card";
import { Button } from "@/components/ui/button";

export function Home() {
	return (
		<div className="flex flex-col h-full">
			<div className="flex justify-center items-center flex-1 ">
				<Card className="bg-accent border-2">
					<CardContent>
						<PixelIcon className="size-40" />
					</CardContent>
				</Card>
			</div>
			<div className="flex justify-center items-center">
				<Button render={<Link to="/transaction/create" />}>
					<Plus />
					<span>New Transaction</span>
				</Button>
			</div>
			<div className="flex-1"></div>
		</div>
	);
}
