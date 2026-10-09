import { ArrowLeft } from "lucide-react";
import type { CoreLayoutProps } from "ra-core";
import type { ErrorInfo } from "react";
import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Button } from "#/components/ui/button";
import { useGoBack } from "#/hooks/use-go-back";
import { useIsMobile } from "#/hooks/use-mobile";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { Error as AdminError } from "@/components/admin/error";
import { Loading } from "@/components/admin/loading";
import { LocalesMenuButton } from "@/components/admin/locales-menu-button";
import { Notification } from "@/components/admin/notification";
import { RefreshButton } from "@/components/admin/refresh-button";
import { ThemeModeToggle } from "@/components/admin/theme-mode-toggle";
import { UserMenu } from "@/components/admin/user-menu";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

/**
 * The main application layout with sidebar, header, and content area.
 *
 * Renders the app structure with a collapsible sidebar, header with breadcrumb navigation,
 * theme toggle, user menu, and main content area. Includes error boundary and loading states.
 *
 * @see {@link https://marmelab.com/shadcn-admin-kit/docs/layout/ Layout documentation}
 */
export const Layout = (props: CoreLayoutProps) => {
	const [errorInfo, setErrorInfo] = useState<ErrorInfo | undefined>(undefined);
	const handleError = (_: unknown, info: ErrorInfo) => {
		setErrorInfo(info);
	};

	const isMobile = useIsMobile();

	const { goBack, isFirstPage } = useGoBack();

	return (
		<SidebarProvider>
			<AppSidebar />
			<main
				className={cn(
					"ms-auto w-full max-w-full",
					"peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]",
					"peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]",
					"sm:transition-[width] sm:duration-200 sm:ease-linear",
					"flex h-svh flex-col",
					"group-data-[scroll-locked=1]/body:h-full",
					"has-[main.fixed-main]:group-data-[scroll-locked=1]/body:h-svh",
				)}
			>
				<header className="flex h-16 md:h-12 shrink-0 items-center gap-2 px-4">
					{isMobile ? (
						<SidebarTrigger className="scale-125 sm:scale-100" />
					) : (
						<Button
							disabled={isFirstPage}
							variant="ghost"
							size="icon-sm"
							onClick={goBack}
						>
							<ArrowLeft className="rtl:rotate-180" />
							<span className="sr-only">Go Back</span>
						</Button>
					)}
					<div className="flex-1 flex items-center" id="breadcrumb" />
					<LocalesMenuButton />
					<ThemeModeToggle />
					<RefreshButton />
					<UserMenu />
				</header>
				<ErrorBoundary
					onError={handleError}
					fallbackRender={({ error, resetErrorBoundary }) => (
						<AdminError
							error={error}
							errorInfo={errorInfo}
							resetErrorBoundary={resetErrorBoundary}
						/>
					)}
				>
					<Suspense fallback={<Loading />}>
						<div className="flex flex-1 flex-col px-4 ">{props.children}</div>
					</Suspense>
				</ErrorBoundary>
			</main>
			<Notification />
		</SidebarProvider>
	);
};
