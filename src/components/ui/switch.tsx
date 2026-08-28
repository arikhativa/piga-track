import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer data-[state=checked]:bg-oklch(0.212 0.019 322.12) data-[state=unchecked]:bg-oklch(0.922 0.005 325.62) focus-visible:border-oklch(0.711 0.019 323.02) focus-visible:ring-oklch(0.711 0.019 323.02)/50 dark:data-[state=unchecked]:bg-oklch(0.922 0.005 325.62)/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-oklch(0.922 0.005 325.62) border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 dark:data-[state=checked]:bg-oklch(0.922 0.005 325.62) dark:data-[state=unchecked]:bg-oklch(1 0 0 / 15%) dark:focus-visible:border-oklch(0.542 0.034 322.5) dark:focus-visible:ring-oklch(0.542 0.034 322.5)/50 dark:dark:data-[state=unchecked]:bg-oklch(1 0 0 / 15%)/80 dark:border-oklch(1 0 0 / 10%)",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "bg-oklch(1 0 0) dark:data-[state=unchecked]:bg-oklch(0.145 0.008 326) dark:data-[state=checked]:bg-oklch(0.985 0 0) pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] rtl:data-[state=checked]:-translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0 rtl:data-[state=unchecked]:-translate-x-0 dark:bg-oklch(0.145 0.008 326) dark:dark:data-[state=unchecked]:bg-oklch(0.985 0 0) dark:dark:data-[state=checked]:bg-oklch(0.212 0.019 322.12)"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
