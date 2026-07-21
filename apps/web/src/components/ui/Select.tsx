"use client";

import type * as React from "react";
import { Select as SelectPrimitive } from "@base-ui/react/select";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";

const selectTriggerVariants = cva(
  "flex items-center justify-between gap-2 rounded-md border border-input bg-transparent text-sm whitespace-nowrap text-foreground shadow-xs transition-[color,box-shadow] outline-none select-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 dark:bg-input/30 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "w-fit py-2 ps-3 pe-2 data-placeholder:text-muted-foreground",
        full: "w-full cursor-pointer appearance-none px-3 data-placeholder:text-muted-foreground",
        compact: "py-1.5 ps-3 pe-1.5 text-xs font-medium hover:bg-accent",
      },
      size: {
        sm: "h-8 rounded-md",
        default: "h-10",
        md: "h-12",
        lg: "h-14",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const Select = SelectPrimitive.Root;

function SelectGroup(props: Omit<SelectPrimitive.Group.Props, "className">) {
  return <SelectPrimitive.Group data-slot="select-group" className="scroll-my-1" {...props} />;
}

function SelectValue(props: Omit<SelectPrimitive.Value.Props, "className">) {
  return (
    <SelectPrimitive.Value data-slot="select-value" className="flex flex-1 text-start" {...props} />
  );
}

function SelectTrigger({
  variant,
  size,
  children,
  ...props
}: Omit<SelectPrimitive.Trigger.Props, "className"> & VariantProps<typeof selectTriggerVariants>) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={selectTriggerVariants({ variant, size })}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon
        render={<ChevronDownIcon className="pointer-events-none size-4 text-muted-foreground" />}
      />
    </SelectPrimitive.Trigger>
  );
}

type SelectContentProps = Omit<
  SelectPrimitive.Popup.Props &
    Pick<
      SelectPrimitive.Positioner.Props,
      "align" | "alignOffset" | "side" | "sideOffset" | "alignItemWithTrigger"
    >,
  "className"
> & {
  header?: React.ReactNode;
};

function SelectContent({
  children,
  header = null,
  side = "bottom",
  sideOffset = 4,
  align = "center",
  alignOffset = 0,
  alignItemWithTrigger = true,
  ...props
}: SelectContentProps) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        alignItemWithTrigger={alignItemWithTrigger}
        className="isolate z-50"
      >
        <SelectPrimitive.Popup
          data-slot="select-content"
          data-align-trigger={alignItemWithTrigger}
          className="relative isolate z-50 max-h-(--available-height) w-(--anchor-width) min-w-36 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md data-[align-trigger=true]:animate-none data-[side=bottom]:slide-in-from-top-1 data-[side=inline-end]:slide-in-from-left-1 data-[side=inline-start]:slide-in-from-right-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
          {...props}
        >
          {header == null ? null : (
            <div className="sticky top-0 z-10 bg-popover pb-1">{header}</div>
          )}
          <SelectScrollUpButton />
          <SelectPrimitive.List>{children}</SelectPrimitive.List>
          <SelectScrollDownButton />
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel(props: Omit<SelectPrimitive.GroupLabel.Props, "className">) {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-label"
      className="px-2 py-1.5 text-xs font-medium text-muted-foreground"
      {...props}
    />
  );
}

function SelectItem({ children, ...props }: Omit<SelectPrimitive.Item.Props, "className">) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className="relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 ps-2 pe-8 text-sm text-popover-foreground outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2"
      {...props}
    >
      <SelectPrimitive.ItemText className="flex flex-1 shrink-0 gap-2 whitespace-nowrap">
        {children}
      </SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator
        render={
          <span className="pointer-events-none absolute inset-e-2 flex size-4 items-center justify-center" />
        }
      >
        <CheckIcon className="pointer-events-none" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
}

function SelectSeparator(props: Omit<SelectPrimitive.Separator.Props, "className">) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className="pointer-events-none h-px bg-border"
      {...props}
    />
  );
}

function SelectScrollUpButton(
  props: Omit<React.ComponentProps<typeof SelectPrimitive.ScrollUpArrow>, "className">,
) {
  return (
    <SelectPrimitive.ScrollUpArrow
      data-slot="select-scroll-up-button"
      className="top-0 z-10 flex w-full cursor-default items-center justify-center bg-transparent py-1 text-muted-foreground [&_svg:not([class*='size-'])]:size-4"
      {...props}
    >
      <ChevronUpIcon />
    </SelectPrimitive.ScrollUpArrow>
  );
}

function SelectScrollDownButton(
  props: Omit<React.ComponentProps<typeof SelectPrimitive.ScrollDownArrow>, "className">,
) {
  return (
    <SelectPrimitive.ScrollDownArrow
      data-slot="select-scroll-down-button"
      className="bottom-0 z-10 flex w-full cursor-default items-center justify-center bg-transparent py-1 text-muted-foreground [&_svg:not([class*='size-'])]:size-4"
      {...props}
    >
      <ChevronDownIcon />
    </SelectPrimitive.ScrollDownArrow>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
