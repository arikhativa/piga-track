import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function Home() {
	return (
		<div className="flex items-center justify-center min-h-[60vh]">
			<Button render={<Link to="/transaction/create" />}>
				<Plus />
				<span>New Transaction</span>
			</Button>
		</div>
	);
}
