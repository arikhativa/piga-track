import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-oklch(0.145 0.008 326) placeholder:text-oklch(0.542 0.034 322.5) selection:bg-oklch(0.212 0.019 322.12) selection:text-oklch(0.985 0 0) dark:bg-oklch(0.922 0.005 325.62)/30 border-oklch(0.922 0.005 325.62) flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:file:text-oklch(0.985 0 0) dark:placeholder:text-oklch(0.711 0.019 323.02) dark:selection:bg-oklch(0.922 0.005 325.62) dark:selection:text-oklch(0.212 0.019 322.12) dark:dark:bg-oklch(1 0 0 / 15%)/30 dark:border-oklch(1 0 0 / 15%) dark:border-oklch(1 0 0 / 10%)",
        "focus-visible:border-oklch(0.711 0.019 323.02) focus-visible:ring-oklch(0.711 0.019 323.02)/50 focus-visible:ring-[3px] dark:focus-visible:border-oklch(0.542 0.034 322.5) dark:focus-visible:ring-oklch(0.542 0.034 322.5)/50",
        "aria-invalid:ring-oklch(0.577 0.245 27.325)/20 dark:aria-invalid:ring-oklch(0.577 0.245 27.325)/40 aria-invalid:border-oklch(0.577 0.245 27.325) dark:aria-invalid:ring-oklch(0.704 0.191 22.216)/20 dark:dark:aria-invalid:ring-oklch(0.704 0.191 22.216)/40 dark:aria-invalid:border-oklch(0.704 0.191 22.216)",
        className
      )}
      {...props}
    />
  )
}

export { Input }
