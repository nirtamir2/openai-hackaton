import type * as React from "react";
import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog";

function AlertDialog(props: AlertDialogPrimitive.Root.Props) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />;
}

function AlertDialogTrigger(props: AlertDialogPrimitive.Trigger.Props) {
  return <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />;
}

function AlertDialogPortal(props: AlertDialogPrimitive.Portal.Props) {
  return <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />;
}

function AlertDialogBackdrop(props: Omit<AlertDialogPrimitive.Backdrop.Props, "className">) {
  return (
    <AlertDialogPrimitive.Backdrop
      data-slot="alert-dialog-backdrop"
      className="fixed inset-0 z-50 bg-black/50 transition-opacity data-ending-style:opacity-0 data-starting-style:opacity-0"
      {...props}
    />
  );
}

function AlertDialogPopup({
  children,
  ...props
}: Omit<AlertDialogPrimitive.Popup.Props, "className">) {
  return (
    <AlertDialogPrimitive.Portal>
      <AlertDialogBackdrop />
      <AlertDialogPrimitive.Popup
        data-slot="alert-dialog-popup"
        className="fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-1/2 rounded-lg border border-border bg-background p-6 text-foreground shadow-lg transition-[transform,opacity] data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0"
        {...props}
      >
        {children}
      </AlertDialogPrimitive.Popup>
    </AlertDialogPrimitive.Portal>
  );
}

function AlertDialogTitle(props: Omit<AlertDialogPrimitive.Title.Props, "className">) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className="text-lg font-semibold text-foreground"
      {...props}
    />
  );
}

function AlertDialogDescription(props: Omit<AlertDialogPrimitive.Description.Props, "className">) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className="pt-2 text-sm text-muted-foreground"
      {...props}
    />
  );
}

function AlertDialogClose(props: AlertDialogPrimitive.Close.Props) {
  return <AlertDialogPrimitive.Close data-slot="alert-dialog-close" {...props} />;
}

function AlertDialogFooter(props: Omit<React.HTMLAttributes<HTMLDivElement>, "className">) {
  return <div data-slot="alert-dialog-footer" className="flex justify-end gap-2 pt-6" {...props} />;
}

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogPortal,
  AlertDialogBackdrop,
  AlertDialogPopup,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogClose,
  AlertDialogFooter,
};
