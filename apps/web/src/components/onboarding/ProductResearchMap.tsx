import clsx from "clsx";
import { FileSearch, Globe2, Search } from "lucide-react";

interface Props {
  isActive: boolean;
}

export function ProductResearchMap({ isActive }: Props) {
  return (
    <div
      className="relative grid aspect-square w-full max-w-72 place-items-center"
      aria-hidden="true"
    >
      <div
        className={clsx(
          "absolute inset-3 rounded-full border border-border",
          isActive ? "motion-safe:animate-[spin_16s_linear_infinite]" : null,
        )}
      >
        <span className="absolute inset-s-[12%] top-[18%] grid size-10 place-items-center rounded-full border-4 border-muted bg-background text-foreground shadow-sm">
          <Globe2 className="size-4" />
        </span>
        <span className="absolute inset-e-[-2%] top-[48%] grid size-10 place-items-center rounded-full border-4 border-muted bg-background text-foreground shadow-sm">
          <Search className="size-4" />
        </span>
        <span className="absolute inset-s-[37%] bottom-[5%] grid size-10 place-items-center rounded-full border-4 border-muted bg-background text-foreground shadow-sm">
          <FileSearch className="size-4" />
        </span>
      </div>

      <div className="absolute inset-[22%] rounded-full border border-border" />
      <div className="absolute h-px w-[42%] rotate-28 bg-border" />
      <div className="absolute h-px w-[34%] rotate-[-52deg] bg-border" />

      <div
        className={clsx(
          "relative grid size-16 place-items-center rounded-full bg-primary text-xs font-bold tracking-[0.18em] text-primary-foreground ring-12 ring-background/60",
          isActive ? "motion-safe:animate-pulse" : null,
        )}
      >
        PA
      </div>
    </div>
  );
}
