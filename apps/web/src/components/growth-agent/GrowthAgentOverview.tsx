import {
  growthAgentDailyRevenue,
  growthAgentRevenueSources,
} from "@/components/growth-agent/growthAgentMockData";

export function GrowthAgentOverview() {
  const maxRevenue = Math.max(...growthAgentDailyRevenue);
  const totalRevenue = growthAgentRevenueSources.reduce((sum, source) => sum + source.revenue, 0);
  const totalSpend = growthAgentRevenueSources.reduce((sum, source) => sum + source.spend, 0);
  const totalCustomers = growthAgentRevenueSources.reduce(
    (sum, source) => sum + source.customers,
    0,
  );
  const maxSourceRevenue = Math.max(...growthAgentRevenueSources.map((source) => source.revenue));

  const dailyBars = growthAgentDailyRevenue.map((value, index) => {
    const isToday = index === growthAgentDailyRevenue.length - 1;

    return {
      pct: Math.round((value / maxRevenue) * 100),
      barColor: isToday ? "#ff5a1f" : "rgba(23,20,15,0.15)",
      tickLabel: isToday
        ? "Today"
        : index % 3 === 0
          ? `${String(growthAgentDailyRevenue.length - index)}d`
          : "",
    };
  });

  const sourceRows = growthAgentRevenueSources.map((source) => ({
    ...source,
    barPct: Math.round((source.revenue / maxSourceRevenue) * 100),
    spendLabel: source.spend > 0 ? `$${source.spend.toLocaleString()}` : "$0",
  }));

  return (
    <div className="flex flex-col">
      <h1 className="mb-1.5 text-[26px] font-semibold tracking-[-0.3px]">Overview</h1>
      <p className="mb-7 text-sm text-[rgba(23,20,15,0.55)]">Last 30 days</p>

      <div className="mb-6 grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        <MetricCard value={`$${totalRevenue.toLocaleString()}`} label="Revenue" accent />
        <MetricCard value={`$${totalSpend.toLocaleString()}`} label="Ad spend" />
        <MetricCard value={`$${(totalRevenue - totalSpend).toLocaleString()}`} label="Net profit" />
        <MetricCard value={String(totalCustomers)} label="New customers" />
      </div>

      <div className="mb-6 rounded-[14px] border border-[rgba(23,20,15,0.1)] bg-white p-6">
        <p className="mb-[18px] text-[12.5px] font-semibold tracking-[0.3px] text-[rgba(23,20,15,0.45)]">
          DAILY REVENUE · LAST 14 DAYS
        </p>
        <div className="flex h-[120px] items-end gap-1.5">
          {dailyBars.map((bar, index) => (
            <div key={`bar-${String(index)}`} className="flex h-full flex-1 items-end">
              <div
                className="w-full rounded-t-[3px]"
                style={{
                  height: `${String(bar.pct)}%`,
                  backgroundColor: bar.barColor,
                }}
              />
            </div>
          ))}
        </div>
        <div className="mt-1.5 flex gap-1.5">
          {dailyBars.map((bar, index) => (
            <div
              key={`tick-${String(index)}`}
              className="flex-1 text-center font-mono text-[9.5px] text-[rgba(23,20,15,0.35)]"
            >
              {bar.tickLabel}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[14px] border border-[rgba(23,20,15,0.1)] bg-white p-6">
        <p className="mb-4 text-[12.5px] font-semibold tracking-[0.3px] text-[rgba(23,20,15,0.45)]">
          REVENUE BY SOURCE
        </p>
        <div className="flex flex-col gap-4">
          {sourceRows.map((source) => (
            <div key={source.name}>
              <div className="mb-[5px] flex items-baseline justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block size-2 shrink-0 rounded-full"
                    style={{ backgroundColor: source.color }}
                  />
                  <span className="text-sm font-medium text-[rgba(23,20,15,0.85)]">
                    {source.name}
                  </span>
                  <span className="text-[11.5px] font-semibold" style={{ color: source.color }}>
                    {source.note}
                  </span>
                </div>
                <span className="font-mono text-sm font-semibold">
                  ${source.revenue.toLocaleString()}
                </span>
              </div>
              <div className="mb-[5px] h-1.5 overflow-hidden rounded-[3px] bg-[rgba(23,20,15,0.06)]">
                <div
                  className="h-full"
                  style={{
                    width: `${String(source.barPct)}%`,
                    backgroundColor: source.color,
                  }}
                />
              </div>
              <div className="flex justify-between font-mono text-[11.5px] text-[rgba(23,20,15,0.4)]">
                <span>{source.utm}</span>
                <span>
                  spend {source.spendLabel} · {source.customers} customers
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  value,
  label,
  accent = false,
}: {
  value: string;
  label: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-[rgba(23,20,15,0.1)] bg-white p-[18px]">
      <p
        className="font-mono text-[26px] font-semibold"
        style={{ color: accent ? "#2f6f4e" : "#17140f" }}
      >
        {value}
      </p>
      <p className="mt-1 text-[12.5px] text-[rgba(23,20,15,0.5)]">{label}</p>
    </div>
  );
}
