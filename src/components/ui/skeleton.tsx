import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-oklch(0.96 0.003 325.6) animate-pulse rounded-md dark:bg-oklch(0.263 0.024 320.12)", className)}
      {...props}
    />
  )
}

export { Skeleton }
