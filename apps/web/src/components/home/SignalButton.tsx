import { Button as ButtonPrimitive } from "@base-ui/react/button";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import type { OmitClassName } from "@/components/ui/OmitClassName";

const signalButtonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-md border text-sm font-medium whitespace-nowrap transition-[color,background-color,border-color] outline-none select-none focus-visible:ring-2 focus-visible:ring-[#17140f]/20 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        primary: "border-transparent bg-[#17140f] text-white hover:bg-[#17140f]/90",
        accent: "border-transparent bg-[#ff5a1f] text-white hover:bg-[#ff5a1f]/90",
        secondary:
          "border-[rgba(23,20,15,0.1)] bg-transparent text-[#17140f] hover:bg-[rgba(23,20,15,0.04)]",
        tertiary: "border-transparent bg-transparent text-[rgba(23,20,15,0.5)] hover:text-[#17140f]",
        sidebarSecondary:
          "border-white/15 bg-transparent text-white hover:bg-white/5",
        sidebarAccent: "border-transparent bg-[#ff5a1f] text-white hover:bg-[#ff5a1f]/90",
      },
      size: {
        default: "h-9 px-4",
        sm: "h-8 px-3 text-xs",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

function SignalButton({
  variant = "primary",
  size = "default",
  ...props
}: OmitClassName<ButtonPrimitive.Props> & VariantProps<typeof signalButtonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="signal-button"
      className={signalButtonVariants({ variant, size })}
      {...props}
    />
  );
}

export { SignalButton, signalButtonVariants };
