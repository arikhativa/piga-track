import {
	House,
	LayoutDashboard,
	List,
	Plus,
	Settings,
	Shell,
	UserPen,
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
import { Link } from "react-router-dom";
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
 * Navigation sidebar displaying menu items, allowing users to navigate between different sections of the application.
 *
 * The sidebar can collapse to an icon-only view and renders as a collapsible drawer on mobile devices.
 * It automatically includes links to the dashboard (if defined) and all list views defined in Resource components.
 *
 * Included in the default Layout component
 *
 * @see {@link https://marmelab.com/shadcn-admin-kit/docs/appsidebar AppSidebar documentation}
 * @see {@link https://ui.shadcn.com/docs/components/sidebar shadcn/ui Sidebar component}
 * @see layout.tsx
 */
export function AppSidebar() {
	const hasDashboard = useHasDashboard();
	const resources = useResourceDefinitions();

	const dashboardMatch = useMatch({ path: "/dashboard", end: true });
	const defaultsMatch = useMatch({ path: "/defaults", end: true });

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
							asChild
							className="data-[slot=sidebar-menu-button]:!p-1.5 h-fit"
						>
							<LinkBase to="/">
								<PixelIcon className="!size-11 h-full" />
								<span className="text-base font-semibold">Lord Pigafetta</span>
							</LinkBase>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroup>
						<SidebarGroupLabel>Main</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{/* ----------------------------------------------------------------------------------------- */}
								<SidebarMenuItem>
									<SidebarMenuButton asChild isActive={!!dashboardMatch}>
										<LinkBase to="/transaction/create" onClick={handleClick}>
											<Plus />
											<span>New Transaction</span>
										</LinkBase>
									</SidebarMenuButton>
								</SidebarMenuItem>

								<SidebarMenuItem>
									<SidebarMenuButton asChild isActive={!!dashboardMatch}>
										<Link to="/dashboard" onClick={handleClick}>
											<LayoutDashboard />
											<span>Dashboard</span>
										</Link>
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
					{tablePages.length && (
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
					{utilsPages.length && (
						<SidebarGroup>
							<SidebarGroupLabel>Utils</SidebarGroupLabel>

							<SidebarGroupContent>
								<SidebarMenu>
									{/* ----------------------------------------------------------------------------------------- */}
									<SidebarMenuItem>
										<SidebarMenuButton asChild isActive={!!defaultsMatch}>
											<Link to="/defaults" onClick={handleClick}>
												<Settings />
												<span>Defaults</span>
											</Link>
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
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter />
		</Sidebar>
	);
}

/**
 * Menu item for the dashboard link in the sidebar.
 *
 * This component renders a sidebar menu item that links to the dashboard page.
 * It displays as active when the user is on the dashboard route.
 *
 * @example
 * <DashboardMenuItem onClick={handleClick} />
 */
export const DashboardMenuItem = ({ onClick }: { onClick?: () => void }) => {
	const translate = useTranslate();
	const label = translate("ra.page.dashboard", {
		_: "Dashboard",
	});
	const match = useMatch({ path: "/", end: true });
	return (
		<SidebarMenuItem>
			<SidebarMenuButton asChild isActive={!!match}>
				<LinkBase to="/" onClick={onClick}>
					<House />
					{label}
				</LinkBase>
			</SidebarMenuButton>
		</SidebarMenuItem>
	);
};

/**
 * Menu item for a resource link in the sidebar.
 *
 * This component renders a sidebar menu item that links to a resource's list view.
 * It checks permissions using canAccess and displays as active when the user is viewing that resource.
 * The component icon and label are derived from the resource definition.
 *
 * @example
 * <ResourceMenuItem key={name} name="posts" onClick={handleClick} />
 */
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
	const match = useMatch({ path: to, end: false });

	if (isPending) {
		return <Skeleton className="h-8 w-full" />;
	}

	if (!resources || !resources[name] || !canAccess) return null;

	return (
		<SidebarMenuItem>
			<SidebarMenuButton asChild isActive={!!match}>
				<LinkBase to={to} state={{ _scrollToTop: true }} onClick={onClick}>
					{resources[name].icon ? (
						createElement(resources[name].icon)
					) : (
						<List />
					)}
					{getResourceLabel(name, 2)}
				</LinkBase>
			</SidebarMenuButton>
		</SidebarMenuItem>
	);
};
