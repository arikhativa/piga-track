import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function Home() {
	return (
		<div className="flex items-center justify-center min-h-[60vh]">
			<Button asChild>
				<Link to="/transaction/create">
					<Plus />
					<p>New Transaction</p>
				</Link>
			</Button>
		</div>
	);
}
