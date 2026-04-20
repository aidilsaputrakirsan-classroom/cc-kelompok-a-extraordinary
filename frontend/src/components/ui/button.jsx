import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-[min(var(--radius-lg),18px)] border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap shadow-[0_10px_30px_-22px_rgba(16,17,20,0.35)] transition-[background-color,color,border-color,box-shadow,transform] duration-200 outline-none select-none focus-visible:border-brand/40 focus-visible:ring-4 focus-visible:ring-brand/15 active:not-aria-[haspopup]:scale-[0.99] disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-4 aria-invalid:ring-destructive/15 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/30 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-[0_14px_30px_-16px_rgba(113,50,245,0.45)] hover:bg-primary/90 hover:shadow-[0_18px_36px_-18px_rgba(113,50,245,0.42)]",
        outline:
          "border-brand/15 bg-background/85 text-foreground hover:border-brand/35 hover:bg-brand-soft hover:text-brand aria-expanded:bg-brand-soft aria-expanded:text-brand dark:border-brand/25 dark:bg-input/25 dark:hover:bg-brand-soft/25",
        secondary:
          "bg-brand-soft text-brand hover:bg-brand-soft/75 aria-expanded:bg-brand-soft aria-expanded:text-brand",
        ghost:
          "text-muted-foreground shadow-none hover:bg-surface-soft hover:text-foreground aria-expanded:bg-surface-soft aria-expanded:text-foreground dark:hover:bg-surface-soft/50",
        destructive:
          "bg-destructive/12 text-destructive hover:bg-destructive/18 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/35",
        link: "text-brand shadow-none underline-offset-4 hover:text-brand/80 hover:underline",
      },
      size: {
        default:
          "h-10 gap-1.5 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        xs: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 gap-1 rounded-[min(var(--radius-md),14px)] px-3 text-[0.84rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-12 gap-2 px-5 text-[0.95rem] has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        icon: "size-10",
        "icon-xs":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-9 rounded-[min(var(--radius-md),14px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props} />
  );
}

export { Button, buttonVariants }
