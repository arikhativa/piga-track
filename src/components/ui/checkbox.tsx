import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer border-oklch(0.922 0.005 325.62) dark:bg-oklch(0.922 0.005 325.62)/30 data-[state=checked]:bg-oklch(0.212 0.019 322.12) data-[state=checked]:text-oklch(0.985 0 0) dark:data-[state=checked]:bg-oklch(0.212 0.019 322.12) data-[state=checked]:border-oklch(0.212 0.019 322.12) focus-visible:border-oklch(0.711 0.019 323.02) focus-visible:ring-oklch(0.711 0.019 323.02)/50 aria-invalid:ring-oklch(0.577 0.245 27.325)/20 dark:aria-invalid:ring-oklch(0.577 0.245 27.325)/40 aria-invalid:border-oklch(0.577 0.245 27.325) size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 dark:border-oklch(1 0 0 / 15%) dark:dark:bg-oklch(1 0 0 / 15%)/30 dark:data-[state=checked]:bg-oklch(0.922 0.005 325.62) dark:data-[state=checked]:text-oklch(0.212 0.019 322.12) dark:dark:data-[state=checked]:bg-oklch(0.922 0.005 325.62) dark:data-[state=checked]:border-oklch(0.922 0.005 325.62) dark:focus-visible:border-oklch(0.542 0.034 322.5) dark:focus-visible:ring-oklch(0.542 0.034 322.5)/50 dark:aria-invalid:ring-oklch(0.704 0.191 22.216)/20 dark:dark:aria-invalid:ring-oklch(0.704 0.191 22.216)/40 dark:aria-invalid:border-oklch(0.704 0.191 22.216) dark:border-oklch(1 0 0 / 10%)",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
