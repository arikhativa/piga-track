import * as React from "react"
import { cva } from "class-variance-authority"
import { NavigationMenu as NavigationMenuPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { ChevronDownIcon } from "lucide-react"

function NavigationMenu({
  className,
  children,
  viewport = true,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & {
  viewport?: boolean
}) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      data-viewport={viewport}
      className={cn(
        "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
        className
      )}
      {...props}
    >
      {children}
      {viewport && <NavigationMenuViewport />}
    </NavigationMenuPrimitive.Root>
  )
}

function NavigationMenuList({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn(
        "group flex flex-1 list-none items-center justify-center gap-0",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={cn("relative", className)}
      {...props}
    />
  )
}

const navigationMenuTriggerStyle = cva(
  "group/navigation-menu-trigger inline-flex h-9 w-max items-center justify-center rounded-2xl px-2.5 py-1.5 text-sm font-medium transition-all outline-none hover:bg-oklch(0.96 0.003 325.6) focus:bg-oklch(0.96 0.003 325.6) focus-visible:ring-3 focus-visible:ring-oklch(0.711 0.019 323.02)/30 focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-popup-open:bg-oklch(0.96 0.003 325.6)/50 data-popup-open:hover:bg-oklch(0.96 0.003 325.6) data-open:bg-oklch(0.96 0.003 325.6)/50 data-open:hover:bg-oklch(0.96 0.003 325.6) data-open:focus:bg-oklch(0.96 0.003 325.6) dark:hover:bg-oklch(0.263 0.024 320.12) dark:focus:bg-oklch(0.263 0.024 320.12) dark:focus-visible:ring-oklch(0.542 0.034 322.5)/30 dark:data-popup-open:bg-oklch(0.263 0.024 320.12)/50 dark:data-popup-open:hover:bg-oklch(0.263 0.024 320.12) dark:data-open:bg-oklch(0.263 0.024 320.12)/50 dark:data-open:hover:bg-oklch(0.263 0.024 320.12) dark:data-open:focus:bg-oklch(0.263 0.024 320.12)"
)

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(navigationMenuTriggerStyle(), "group", className)}
      {...props}
    >
      {children}{""}
      <ChevronDownIcon className="relative top-px ms-1 size-3 transition duration-300 group-data-popup-open/navigation-menu-trigger:rotate-180 group-data-open/navigation-menu-trigger:rotate-180" aria-hidden="true" />
    </NavigationMenuPrimitive.Trigger>
  )
}

function NavigationMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        "top-0 start-0 w-full p-1.5 ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-1.5 group-data-[viewport=false]/navigation-menu:overflow-hidden group-data-[viewport=false]/navigation-menu:rounded-2xl group-data-[viewport=false]/navigation-menu:bg-oklch(1 0 0) group-data-[viewport=false]/navigation-menu:text-oklch(0.145 0.008 326) group-data-[viewport=false]/navigation-menu:shadow-lg group-data-[viewport=false]/navigation-menu:ring-1 group-data-[viewport=false]/navigation-menu:ring-oklch(0.145 0.008 326)/5 group-data-[viewport=false]/navigation-menu:duration-300 data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 data-[motion^=from-]:animate-in data-[motion^=from-]:fade-in data-[motion^=to-]:animate-out data-[motion^=to-]:fade-out **:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none md:absolute md:w-auto group-data-[viewport=false]/navigation-menu:dark:ring-oklch(0.145 0.008 326)/10 group-data-[viewport=false]/navigation-menu:data-open:animate-in group-data-[viewport=false]/navigation-menu:data-open:fade-in-0 group-data-[viewport=false]/navigation-menu:data-open:zoom-in-95 group-data-[viewport=false]/navigation-menu:data-closed:animate-out group-data-[viewport=false]/navigation-menu:data-closed:fade-out-0 group-data-[viewport=false]/navigation-menu:data-closed:zoom-out-95 dark:group-data-[viewport=false]/navigation-menu:bg-oklch(0.212 0.019 322.12) dark:group-data-[viewport=false]/navigation-menu:text-oklch(0.985 0 0) dark:group-data-[viewport=false]/navigation-menu:ring-oklch(0.985 0 0)/5 dark:group-data-[viewport=false]/navigation-menu:dark:ring-oklch(0.985 0 0)/10",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuViewport({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
  return (
    <div
      className={cn(
        "absolute top-full start-0 isolate z-50 flex justify-center"
      )}
    >
      <NavigationMenuPrimitive.Viewport
        data-slot="navigation-menu-viewport"
        className={cn(
          "origin-top-center relative mt-1.5 h-(--radix-navigation-menu-viewport-height) w-full overflow-hidden rounded-2xl bg-oklch(1 0 0) text-oklch(0.145 0.008 326) shadow-lg ring-1 ring-oklch(0.145 0.008 326)/5 duration-100 md:w-(--radix-navigation-menu-viewport-width) dark:ring-oklch(0.145 0.008 326)/10 data-open:animate-in data-open:zoom-in-90 data-closed:animate-out data-closed:zoom-out-90 dark:bg-oklch(0.212 0.019 322.12) dark:text-oklch(0.985 0 0) dark:ring-oklch(0.985 0 0)/5 dark:dark:ring-oklch(0.985 0 0)/10",
          className
        )}
        {...props}
      />
    </div>
  )
}

function NavigationMenuLink({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        "flex items-center gap-2 rounded-2xl px-2.5 py-1.5 text-sm font-medium transition-all outline-none hover:bg-oklch(0.96 0.003 325.6) focus:bg-oklch(0.96 0.003 325.6) focus-visible:ring-3 focus-visible:ring-oklch(0.711 0.019 323.02)/30 focus-visible:outline-1 in-data-[slot=navigation-menu-content]:w-full in-data-[slot=navigation-menu-content]:rounded-xl in-data-[slot=navigation-menu-content]:p-2 in-data-[slot=navigation-menu-content]:font-normal data-[active=true]:bg-oklch(0.96 0.003 325.6)/50 data-[active=true]:hover:bg-oklch(0.96 0.003 325.6) data-[active=true]:focus:bg-oklch(0.96 0.003 325.6) [&_svg:not([class*='size-'])]:size-4 dark:hover:bg-oklch(0.263 0.024 320.12) dark:focus:bg-oklch(0.263 0.024 320.12) dark:focus-visible:ring-oklch(0.542 0.034 322.5)/30 dark:data-[active=true]:bg-oklch(0.263 0.024 320.12)/50 dark:data-[active=true]:hover:bg-oklch(0.263 0.024 320.12) dark:data-[active=true]:focus:bg-oklch(0.263 0.024 320.12)",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuIndicator({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Indicator>) {
  return (
    <NavigationMenuPrimitive.Indicator
      data-slot="navigation-menu-indicator"
      className={cn(
        "top-full z-1 flex h-1.5 items-end justify-center overflow-hidden data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:animate-in data-[state=visible]:fade-in",
        className
      )}
      {...props}
    >
      <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-ss-sm bg-oklch(0.922 0.005 325.62) shadow-md dark:bg-oklch(1 0 0 / 10%)" />
    </NavigationMenuPrimitive.Indicator>
  )
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
}
