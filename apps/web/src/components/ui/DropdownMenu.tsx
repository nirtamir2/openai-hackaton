import type * as React from "react";
import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { clsx } from "clsx";
import { CheckIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { getTextDirection } from "@/paraglide/runtime.js";

function DropdownMenu(props: MenuPrimitive.Root.Props) {
  return <MenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

function DropdownMenuPortal(props: MenuPrimitive.Portal.Props) {
  return <MenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />;
}

function DropdownMenuTrigger(props: MenuPrimitive.Trigger.Props) {
  return <MenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />;
}

function DropdownMenuContent({
  align = "end",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 6,
  ...props
}: Omit<
  MenuPrimitive.Popup.Props &
    Pick<MenuPrimitive.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset">,
  "className"
>) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        className="isolate z-50 outline-none"
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
      >
        <MenuPrimitive.Popup
          data-slot="dropdown-menu-content"
          className="z-50 max-h-(--available-height) w-(--anchor-width) min-w-40 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-md border border-border bg-popover p-1 text-popover-foreground opacity-100 shadow-md data-ending-style:transition-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:scale-95 data-closed:opacity-0"
          {...props}
        />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  );
}

function DropdownMenuGroup(props: MenuPrimitive.Group.Props) {
  return <MenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />;
}

function DropdownMenuLabel(props: Omit<MenuPrimitive.GroupLabel.Props, "className">) {
  return (
    <MenuPrimitive.GroupLabel
      data-slot="dropdown-menu-label"
      className="px-2 py-1.5 text-sm font-medium text-foreground"
      {...props}
    />
  );
}

function DropdownMenuItem({
  variant = "default",
  ...props
}: Omit<
  MenuPrimitive.Item.Props & {
    variant?: "default" | "destructive";
  },
  "className"
>) {
  return (
    <MenuPrimitive.Item
      data-slot="dropdown-menu-item"
      className={clsx(
        "group/dropdown-menu-item relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        variant === "default" &&
          "text-popover-foreground focus:bg-accent focus:text-accent-foreground",
        variant === "destructive" &&
          "text-destructive focus:bg-destructive/10 focus:text-destructive",
      )}
      {...props}
    />
  );
}

function DropdownMenuSub(props: MenuPrimitive.SubmenuRoot.Props) {
  return <MenuPrimitive.SubmenuRoot data-slot="dropdown-menu-sub" {...props} />;
}

function DropdownMenuSubTrigger({
  children,
  ...props
}: Omit<MenuPrimitive.SubmenuTrigger.Props, "className">) {
  const direction = getTextDirection();

  return (
    <MenuPrimitive.SubmenuTrigger
      data-slot="dropdown-menu-sub-trigger"
      className="flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-popover-foreground outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-open:bg-accent data-open:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
      {...props}
    >
      {children}
      {direction === "rtl" ? (
        <ChevronLeftIcon className="ms-auto" />
      ) : (
        <ChevronRightIcon className="ms-auto" />
      )}
    </MenuPrimitive.SubmenuTrigger>
  );
}

function DropdownMenuSubContent({
  align = "start",
  alignOffset = -3,
  side = "right",
  sideOffset = 0,
  ...props
}: React.ComponentProps<typeof DropdownMenuContent>) {
  const direction = getTextDirection();
  let resolvedSide = side;

  if (side === "right") {
    resolvedSide = direction === "rtl" ? "left" : "right";
  }

  return (
    <DropdownMenuContent
      data-slot="dropdown-menu-sub-content"
      align={align}
      alignOffset={alignOffset}
      side={resolvedSide}
      sideOffset={sideOffset}
      {...props}
    />
  );
}

function DropdownMenuCheckboxItem({
  children,
  checked,
  ...props
}: Omit<MenuPrimitive.CheckboxItem.Props, "className">) {
  return (
    <MenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      className="relative flex cursor-default items-center gap-2 rounded-sm py-1.5 ps-2 pe-8 text-sm text-popover-foreground outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
      checked={checked}
      {...props}
    >
      <span
        className="pointer-events-none absolute inset-e-2 flex items-center justify-center"
        data-slot="dropdown-menu-checkbox-item-indicator"
      >
        <MenuPrimitive.CheckboxItemIndicator>
          <CheckIcon />
        </MenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </MenuPrimitive.CheckboxItem>
  );
}

function DropdownMenuRadioGroup(props: MenuPrimitive.RadioGroup.Props) {
  return <MenuPrimitive.RadioGroup data-slot="dropdown-menu-radio-group" {...props} />;
}

function DropdownMenuRadioItem({
  children,
  ...props
}: Omit<MenuPrimitive.RadioItem.Props, "className">) {
  return (
    <MenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      className="relative flex cursor-default items-center gap-2 rounded-sm py-1.5 ps-2 pe-8 text-sm text-popover-foreground outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
      {...props}
    >
      <span
        className="pointer-events-none absolute inset-e-2 flex items-center justify-center"
        data-slot="dropdown-menu-radio-item-indicator"
      >
        <MenuPrimitive.RadioItemIndicator>
          <CheckIcon />
        </MenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </MenuPrimitive.RadioItem>
  );
}

function DropdownMenuSeparator(props: Omit<MenuPrimitive.Separator.Props, "className">) {
  return (
    <MenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className="h-px bg-border"
      {...props}
    />
  );
}

function DropdownMenuShortcut(props: Omit<React.ComponentProps<"span">, "className">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className="ms-auto text-xs tracking-widest text-muted-foreground"
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
};
