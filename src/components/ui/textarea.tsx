import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-oklch(0.922 0.005 325.62) placeholder:text-oklch(0.542 0.034 322.5) focus-visible:border-oklch(0.711 0.019 323.02) focus-visible:ring-oklch(0.711 0.019 323.02)/50 aria-invalid:ring-oklch(0.577 0.245 27.325)/20 dark:aria-invalid:ring-oklch(0.577 0.245 27.325)/40 aria-invalid:border-oklch(0.577 0.245 27.325) dark:bg-oklch(0.922 0.005 325.62)/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:border-oklch(1 0 0 / 15%) dark:placeholder:text-oklch(0.711 0.019 323.02) dark:focus-visible:border-oklch(0.542 0.034 322.5) dark:focus-visible:ring-oklch(0.542 0.034 322.5)/50 dark:aria-invalid:ring-oklch(0.704 0.191 22.216)/20 dark:dark:aria-invalid:ring-oklch(0.704 0.191 22.216)/40 dark:aria-invalid:border-oklch(0.704 0.191 22.216) dark:dark:bg-oklch(1 0 0 / 15%)/30 dark:border-oklch(1 0 0 / 10%)",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
