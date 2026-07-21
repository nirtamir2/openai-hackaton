import type * as React from "react";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

export const surfaceVariants = cva(
  "overflow-hidden border text-card-foreground shadow-sm transition-[border-color,background-color,box-shadow]",
  {
    variants: {
      tone: {
        neutral: "border-border bg-card",
        raised: "border-border bg-popover text-popover-foreground",
        accent: "border-border bg-accent text-accent-foreground",
        danger: "border-destructive/35 bg-destructive/10",
      },
      radius: {
        sm: "rounded-lg",
        default: "rounded-lg",
        lg: "rounded-xl",
      },
      padding: {
        none: "p-0",
        sm: "p-3",
        default: "p-4 md:p-5",
        lg: "p-6 md:p-8",
      },
      interactive: {
        true: "cursor-pointer hover:bg-accent hover:text-accent-foreground",
        false: "",
      },
      align: {
        start: "text-start",
        center: "text-center",
      },
      fullHeight: {
        true: "h-full",
        false: "",
      },
      maxWidth: {
        none: "",
        sm: "mx-auto max-w-sm",
        md: "mx-auto max-w-md",
        "full-md": "w-full max-w-md",
      },
      groupRelative: {
        true: "group relative",
        false: "",
      },
    },
    defaultVariants: {
      tone: "neutral",
      radius: "default",
      padding: "default",
      interactive: false,
      align: "start",
      fullHeight: false,
      maxWidth: "none",
      groupRelative: false,
    },
  },
);

interface Props
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, "className">,
    VariantProps<typeof surfaceVariants> {
  ref?: React.RefObject<HTMLDivElement | null>;
}

export function Surface({
  ref,
  tone,
  radius,
  padding,
  interactive,
  align,
  fullHeight,
  maxWidth,
  groupRelative,
  ...props
}: Props) {
  return (
    <div
      ref={ref}
      data-slot="surface"
      className={surfaceVariants({
        tone,
        radius,
        padding,
        interactive,
        align,
        fullHeight,
        maxWidth,
        groupRelative,
      })}
      {...props}
    />
  );
}
