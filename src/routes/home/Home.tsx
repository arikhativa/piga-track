import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function Home() {
	return (
		<div className="flex items-center justify-center min-h-[60vh]">
			<Button asChild>
				<Link to="/transaction/create">Create New Transaction</Link>
			</Button>
		</div>
	);
}
