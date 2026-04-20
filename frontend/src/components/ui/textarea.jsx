import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({
  className,
  ...props
}) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-32 w-full rounded-2xl border border-border/80 bg-white/85 px-3 py-3 text-base leading-6 shadow-[0_1px_2px_rgba(16,17,20,0.04)] transition-[background-color,border-color,box-shadow] duration-200 outline-none placeholder:text-muted-foreground/90 focus-visible:border-brand/40 focus-visible:ring-4 focus-visible:ring-brand/15 disabled:cursor-not-allowed disabled:bg-input/60 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-4 aria-invalid:ring-destructive/15 md:text-sm dark:bg-input/40 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/30",
        className
      )}
      {...props} />
  );
}

export { Textarea }
