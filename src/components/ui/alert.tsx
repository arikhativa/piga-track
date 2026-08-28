import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border border-oklch(0.922 0.005 325.62) px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current dark:border-oklch(1 0 0 / 10%)",
  {
    variants: {
      variant: {
        default: "bg-oklch(1 0 0) text-oklch(0.145 0.008 326) dark:bg-oklch(0.212 0.019 322.12) dark:text-oklch(0.985 0 0)",
        destructive:
          "text-oklch(0.577 0.245 27.325) bg-oklch(1 0 0) [&>svg]:text-current *:data-[slot=alert-description]:text-oklch(0.577 0.245 27.325)/90 dark:text-oklch(0.704 0.191 22.216) dark:bg-oklch(0.212 0.019 322.12) dark:*:data-[slot=alert-description]:text-oklch(0.704 0.191 22.216)/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight",
        className
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-oklch(0.542 0.034 322.5) col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed dark:text-oklch(0.711 0.019 323.02)",
        className
      )}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription }
