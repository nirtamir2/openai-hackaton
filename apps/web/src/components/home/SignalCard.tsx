import type * as React from "react";

interface Props {
  children: React.ReactNode;
}

export function SignalCard({ children }: Props) {
  return (
    <div className="flex flex-col gap-4 rounded-[12px] border border-[rgba(23,20,15,0.1)] bg-white p-5 shadow-[0_1px_2px_rgba(23,20,15,0.03)]">
      {children}
    </div>
  );
}
