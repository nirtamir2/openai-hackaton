import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import type { OmitClassName } from "@/components/ui/OmitClassName";

const switchVariants = cva(
  "group/switch relative inline-flex shrink-0 items-center rounded-full border border-transparent transition-all outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 data-checked:bg-primary data-unchecked:bg-input dark:data-unchecked:bg-input/80",
  {
    variants: {
      size: {
        default: "h-[18.4px] w-8",
        sm: "h-3.5 w-6",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

const switchThumbVariants = cva(
  "pointer-events-none block rounded-full bg-background ring-0 transition-transform dark:data-checked:bg-primary-foreground dark:data-unchecked:bg-foreground",
  {
    variants: {
      size: {
        default:
          "size-4 data-checked:translate-x-[calc(100%-2px)] data-unchecked:translate-x-0",
        sm: "size-3 data-checked:translate-x-[calc(100%-2px)] data-unchecked:translate-x-0",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

function Switch({
  size = "default",
  ...props
}: OmitClassName<SwitchPrimitive.Root.Props> & VariantProps<typeof switchVariants>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={switchVariants({ size })}
      {...props}
    >
      <SwitchPrimitive.Thumb data-slot="switch-thumb" className={switchThumbVariants({ size })} />
    </SwitchPrimitive.Root>
  );
}

export { Switch, switchVariants };
