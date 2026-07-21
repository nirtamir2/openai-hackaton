import type * as React from "react";

export function Skeleton({ style, ...props }: Omit<React.ComponentProps<"div">, "className">) {
  return (
    <div
      data-slot="skeleton"
      className="animate-pulse rounded-md bg-[rgba(23,20,15,0.08)]"
      style={style}
      {...props}
    />
  );
}
