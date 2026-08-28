import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { CircleIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-3", className)}
      {...props}
    />
  )
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "border-oklch(0.922 0.005 325.62) text-oklch(0.212 0.019 322.12) focus-visible:border-oklch(0.711 0.019 323.02) focus-visible:ring-oklch(0.711 0.019 323.02)/50 aria-invalid:ring-oklch(0.577 0.245 27.325)/20 dark:aria-invalid:ring-oklch(0.577 0.245 27.325)/40 aria-invalid:border-oklch(0.577 0.245 27.325) dark:bg-oklch(0.922 0.005 325.62)/30 aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 dark:border-oklch(1 0 0 / 15%) dark:text-oklch(0.922 0.005 325.62) dark:focus-visible:border-oklch(0.542 0.034 322.5) dark:focus-visible:ring-oklch(0.542 0.034 322.5)/50 dark:aria-invalid:ring-oklch(0.704 0.191 22.216)/20 dark:dark:aria-invalid:ring-oklch(0.704 0.191 22.216)/40 dark:aria-invalid:border-oklch(0.704 0.191 22.216) dark:dark:bg-oklch(1 0 0 / 15%)/30 dark:border-oklch(1 0 0 / 10%)",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="relative flex items-center justify-center"
      >
        <CircleIcon className="fill-primary absolute top-1/2 start-1/2 size-2 -translate-x-1/2 rtl:translate-x-1/2 -translate-y-1/2" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
}

export { RadioGroup, RadioGroupItem }
