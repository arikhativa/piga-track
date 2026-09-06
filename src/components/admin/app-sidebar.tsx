import {
	House,
	LayoutDashboard,
	List,
	Plus,
	Settings,
	Shell,
} from "lucide-react";
import {
	LinkBase,
	useCanAccess,
	useCreatePath,
	useGetResourceLabel,
	useHasDashboard,
	useMatch,
	useResourceDefinitions,
	useTranslate,
} from "ra-core";
import { createElement } from "react";
import PixelIcon from "#/components/icon/lord pigafetta";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Navigation sidebar displaying menu items, allowing users to navigate between
 * different sections of the application.
 */
export function AppSidebar() {
	const hasDashboard = useHasDashboard();
	const resources = useResourceDefinitions();

	const dashboardMatch = useMatch({
		path: "/dashboard",
		end: true,
	});

	const defaultsMatch = useMatch({
		path: "/defaults",
		end: true,
	});

	const mainPages = Object.keys(resources).filter(
		(name) =>
			resources[name].hasList && resources[name]?.options?.main === true,
	);

	const tablePages = Object.keys(resources).filter(
		(name) =>
			resources[name].hasList && resources[name]?.options?.table === true,
	);

	const utilsPages = Object.keys(resources).filter(
		(name) =>
			resources[name].hasList && resources[name]?.options?.util === true,
	);

	const { openMobile, setOpenMobile } = useSidebar();

	const handleClick = () => {
		if (openMobile) {
			setOpenMobile(false);
		}
	};

	return (
		<Sidebar variant="floating" collapsible="icon">
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							render={<LinkBase to="/" />}
							className="data-[slot=sidebar-menu-button]:!p-1.5 h-fit"
						>
							<PixelIcon className="!size-11 h-full" />
							<span className="text-base font-semibold">Lord Pigafetta</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent>
				{/* Main */}
				<SidebarGroup>
					<SidebarGroupLabel>Main</SidebarGroupLabel>

					<SidebarGroupContent>
						<SidebarMenu>
							{/* ----------------------------------------------------------------------------------------- */}
							<SidebarMenuItem>
								<SidebarMenuButton
									render={
										<LinkBase to="/transaction/create" onClick={handleClick} />
									}
									isActive={!!dashboardMatch}
								>
									<Plus />
									<span>New Transaction</span>
								</SidebarMenuButton>
							</SidebarMenuItem>

							{/* Dashboard */}
							<SidebarMenuItem>
								<SidebarMenuButton
									render={<LinkBase to="/dashboard" onClick={handleClick} />}
									isActive={!!dashboardMatch}
								>
									<LayoutDashboard />
									<span>Dashboard</span>
								</SidebarMenuButton>
							</SidebarMenuItem>
							{/* ----------------------------------------------------------------------------------------- */}

							{hasDashboard ? (
								<DashboardMenuItem onClick={handleClick} />
							) : null}
							{mainPages.map((name) => (
								<ResourceMenuItem
									key={name}
									name={name}
									onClick={handleClick}
								/>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				{/* Tables */}
				{tablePages.length > 0 && (
					<SidebarGroup>
						<SidebarGroupLabel>Tables</SidebarGroupLabel>

						<SidebarGroupContent>
							<SidebarMenu>
								{hasDashboard ? (
									<DashboardMenuItem onClick={handleClick} />
								) : null}

								{tablePages.map((name) => (
									<ResourceMenuItem
										key={name}
										name={name}
										onClick={handleClick}
									/>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				)}

				{/* Utils */}
				{utilsPages.length > 0 && (
					<SidebarGroup>
						<SidebarGroupLabel>Utils</SidebarGroupLabel>

						<SidebarGroupContent>
							<SidebarMenu>
								{/* ----------------------------------------------------------------------------------------- */}

								<SidebarMenuItem>
									<SidebarMenuButton
										render={<LinkBase to="/defaults" onClick={handleClick} />}
										isActive={!!defaultsMatch}
									>
										<Settings />
										<span>Defaults</span>
									</SidebarMenuButton>
								</SidebarMenuItem>
								{/* ----------------------------------------------------------------------------------------- */}

								{hasDashboard ? (
									<DashboardMenuItem onClick={handleClick} />
								) : null}

								{utilsPages.map((name) => (
									<ResourceMenuItem
										key={name}
										name={name}
										onClick={handleClick}
									/>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				)}
			</SidebarContent>

			<SidebarFooter />
		</Sidebar>
	);
}

export const DashboardMenuItem = ({ onClick }: { onClick?: () => void }) => {
	const translate = useTranslate();

	const label = translate("ra.page.dashboard", {
		_: "Dashboard",
	});

	const match = useMatch({
		path: "/",
		end: true,
	});

	return (
		<SidebarMenuItem>
			<SidebarMenuButton
				render={<LinkBase to="/" onClick={onClick} />}
				isActive={!!match}
			>
				<House />
				{label}
			</SidebarMenuButton>
		</SidebarMenuItem>
	);
};

export const ResourceMenuItem = ({
	name,
	onClick,
}: {
	name: string;
	onClick?: () => void;
}) => {
	const { canAccess, isPending } = useCanAccess({
		resource: name,
		action: "list",
	});

	const resources = useResourceDefinitions();
	const getResourceLabel = useGetResourceLabel();
	const createPath = useCreatePath();

	const to = createPath({
		resource: name,
		type: "list",
	});

	const match = useMatch({
		path: to,
		end: false,
	});

	if (isPending) {
		return <Skeleton className="h-8 w-full" />;
	}

	if (!resources || !resources[name] || !canAccess) {
		return null;
	}

	return (
		<SidebarMenuItem>
			<SidebarMenuButton
				render={
					<LinkBase to={to} state={{ _scrollToTop: true }} onClick={onClick} />
				}
				isActive={!!match}
			>
				{resources[name].icon ? createElement(resources[name].icon) : <List />}

				{getResourceLabel(name, 2)}
			</SidebarMenuButton>
		</SidebarMenuItem>
	);
};
