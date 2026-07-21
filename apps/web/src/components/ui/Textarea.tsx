import type * as React from "react";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

export const textareaVariants = cva(
  "flex field-sizing-content min-h-20 w-full resize-y rounded-md border bg-transparent px-3 py-2 text-base text-foreground shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:aria-invalid:ring-destructive/40",
  {
    variants: {
      tone: {
        neutral: "border-input",
        danger:
          "border-destructive bg-destructive/5 focus-visible:border-destructive focus-visible:ring-destructive/20",
      },
    },
    defaultVariants: {
      tone: "neutral",
    },
  },
);

interface Props
  extends
    Omit<React.ComponentProps<"textarea">, "className">,
    VariantProps<typeof textareaVariants> {
  ref?: React.RefObject<HTMLTextAreaElement | null>;
}

function Textarea({ ref, tone, ...props }: Props) {
  return (
    <textarea ref={ref} data-slot="textarea" className={textareaVariants({ tone })} {...props} />
  );
}

export { Textarea };
