import type { ReactNode } from "react";
import clsx from "clsx";
import { BarChart3, CalendarDays } from "lucide-react";

export type GrowthAgentTab = "feed" | "overview";

interface Props {
  activeTab: GrowthAgentTab;
  onTabChange: (tab: GrowthAgentTab) => void;
  openTaskCount: number;
  companyName: string;
  children: ReactNode;
}

function GrowthAgentNavItem({
  isActive,
  label,
  icon: Icon,
  badge,
  onClick,
}: {
  isActive: boolean;
  label: string;
  icon: typeof CalendarDays;
  badge: number | null;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left transition-colors",
        isActive ? "bg-white/8 text-white" : "text-white/55 hover:bg-white/5 hover:text-white",
      )}
    >
      <Icon className="size-[15px] shrink-0 stroke-[2]" />
      <span className="text-[13.5px] font-medium">{label}</span>
      {badge != null ? (
        <span className="ms-auto rounded-[10px] bg-[#ff5a1f] px-1.5 py-px font-mono text-[10.5px] font-semibold text-[#17140f]">
          {badge}
        </span>
      ) : null}
    </button>
  );
}

export function GrowthAgentLayout({
  activeTab,
  onTabChange,
  openTaskCount,
  companyName,
  children,
}: Props) {
  return (
    <div className="signal-home flex min-h-screen bg-[#f7f5f1] text-[#17140f]">
      <aside className="flex w-[248px] shrink-0 flex-col gap-9 bg-[#17140f] px-5 py-7 text-white/92">
        <div className="flex items-center gap-2.5">
          <div className="flex size-7 items-center justify-center rounded-[7px] bg-[#ff5a1f] font-mono text-sm font-semibold text-[#17140f]">
            S
          </div>
          <div className="flex flex-col gap-px">
            <span className="text-[15px] font-semibold tracking-[0.2px]">Signal</span>
            <span className="text-[10.5px] tracking-[0.3px] text-white/45">GROWTH CO-PILOT</span>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          <GrowthAgentNavItem
            isActive={activeTab === "feed"}
            label="Feed"
            icon={CalendarDays}
            badge={openTaskCount}
            onClick={() => {
              onTabChange("feed");
            }}
          />
          <GrowthAgentNavItem
            isActive={activeTab === "overview"}
            label="Overview"
            icon={BarChart3}
            badge={null}
            onClick={() => {
              onTabChange("overview");
            }}
          />
        </nav>

        <div className="mt-auto flex flex-col gap-3.5">
          <div className="h-px bg-white/10" />
          <div className="flex items-center gap-2.5">
            <div className="flex size-[30px] items-center justify-center rounded-lg bg-[#2a2620] text-xs font-semibold text-white/80">
              {companyName.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col gap-px">
              <span className="text-[12.5px] font-medium">{companyName}</span>
              <span className="text-[10.5px] text-white/40">Solo founder plan</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 px-10 py-10 lg:px-12">
        <div className="mx-auto flex w-full max-w-[960px] flex-col">{children}</div>
      </main>
    </div>
  );
}
