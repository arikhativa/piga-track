import { LayoutDashboard, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import GlareHover from "#/components/GlareHover";
import PixelIcon from "#/components/icon/lord-pigafetta";
import { Card, CardContent } from "#/components/ui/card";
import { Button } from "@/components/ui/button";

export function Home() {
	return (
		<div className="flex flex-col h-full">
			<div className="flex justify-center items-center flex-1">
				<Link to="/transaction/create">
					<GlareHover
						width="auto"
						height="auto"
						background="transparent"
						borderColor="transparent"
						borderRadius="0.5rem"
						glareColor="var(--glare-color)"
						glareOpacity={0.25}
						glareAngle={-30}
						glareSize={250}
						transitionDuration={800}
					>
						<Card className="bg-accent border-2">
							<CardContent>
								<PixelIcon className="size-40" />
							</CardContent>
						</Card>
					</GlareHover>
				</Link>
			</div>

			<div className="flex flex-col gap-4 md:flex-row md:justify-center md:items-center px-20 md:px-auto">
				<Button nativeButton={false} render={<Link to="/dashboard" />}>
					<LayoutDashboard />
					<span>Dashboard</span>
				</Button>
				<Button nativeButton={false} render={<Link to="/transaction/create" />}>
					<Plus />
					<span>New Transaction</span>
				</Button>
			</div>

			<div className="flex-1" />
		</div>
	);
}
