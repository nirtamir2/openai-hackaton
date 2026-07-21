const dailyRevenue = [180, 210, 195, 260, 240, 310, 290, 330, 355, 300, 410, 380, 390, 460];

const revenueSources = [
  {
    name: "Reddit (agent replies)",
    utm: "utm_source=reddit&utm_medium=organic",
    revenue: 2980,
    spend: 0,
    customers: 35,
    color: "#c9440e",
    note: "organic · agent-sourced",
  },
  {
    name: "Meta Ads",
    utm: "utm_source=meta&utm_campaign=tired_of_gamified",
    revenue: 2340,
    spend: 620,
    customers: 28,
    color: "#2f5fd6",
    note: "3.8x ROAS",
  },
  {
    name: "Google Search Ads",
    utm: "utm_source=google&utm_campaign=duolingo_alternatives",
    revenue: 1860,
    spend: 530,
    customers: 21,
    color: "#6a3fd1",
    note: "3.5x ROAS",
  },
  {
    name: "Direct / unattributed",
    utm: "no UTM captured",
    revenue: 1240,
    spend: 0,
    customers: 12,
    color: "rgba(23,20,15,0.35)",
    note: "unknown source",
  },
];

const overviewMetrics = [
  { label: "Revenue", value: "$8,420", color: "text-[#2f6f4e]" },
  { label: "Ad spend", value: "$1,150", color: "text-[#17140f]" },
  { label: "Net profit", value: "$7,270", color: "text-[#17140f]" },
  { label: "New customers", value: "96", color: "text-[#17140f]" },
];

export function GrowthAgentOverview() {
  const highestDailyRevenue = Math.max(...dailyRevenue);
  const highestSourceRevenue = Math.max(...revenueSources.map((source) => source.revenue));

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-1.5">
        <h1 className="text-[26px] font-semibold tracking-[-0.3px]">Overview</h1>
        <p className="text-sm text-[rgba(23,20,15,0.55)]">Last 30 days</p>
      </header>

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
        {overviewMetrics.map((metric) => (
          <div
            key={metric.label}
            className="flex min-w-0 flex-col gap-1 rounded-xl border border-[rgba(23,20,15,0.1)] bg-white p-[18px]"
          >
            <p className={`font-mono text-[26px] font-semibold ${metric.color}`}>{metric.value}</p>
            <p className="text-[12.5px] text-[rgba(23,20,15,0.5)]">{metric.label}</p>
          </div>
        ))}
      </div>

      <section className="flex flex-col gap-[18px] rounded-[14px] border border-[rgba(23,20,15,0.1)] bg-white px-4 py-[22px] sm:px-6">
        <h2 className="text-[12.5px] font-semibold tracking-[0.3px] text-[rgba(23,20,15,0.45)]">
          DAILY REVENUE · LAST 14 DAYS
        </h2>
        <div className="flex h-[120px] items-end gap-1.5" aria-label="Daily revenue for the last 14 days">
          {dailyRevenue.map((revenue, index) => {
            const isToday = index === dailyRevenue.length - 1;
            const height = Math.round((revenue / highestDailyRevenue) * 100);

            return (
              <div key={revenue + index} className="flex h-full min-w-0 flex-1 items-end">
                <div
                  className={isToday ? "w-full rounded-t-[3px] bg-[#ff5a1f]" : "w-full rounded-t-[3px] bg-[rgba(23,20,15,0.15)]"}
                  style={{ height: `${height}%` }}
                  title={`$${revenue.toLocaleString()}`}
                />
              </div>
            );
          })}
        </div>
        <div className="flex gap-1.5" aria-hidden="true">
          {dailyRevenue.map((_, index) => {
            const daysAgo = dailyRevenue.length - index;
            const label = index === dailyRevenue.length - 1 ? "Today" : index % 3 === 0 ? `${daysAgo}d` : "";

            return (
              <span
                key={index}
                className="min-w-0 flex-1 text-center font-mono text-[9.5px] text-[rgba(23,20,15,0.35)]"
              >
                {label}
              </span>
            );
          })}
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-[14px] border border-[rgba(23,20,15,0.1)] bg-white px-4 py-[22px] sm:px-6">
        <h2 className="text-[12.5px] font-semibold tracking-[0.3px] text-[rgba(23,20,15,0.45)]">
          REVENUE BY SOURCE
        </h2>
        <div className="flex flex-col gap-4">
          {revenueSources.map((source) => {
            const share = Math.round((source.revenue / highestSourceRevenue) * 100);

            return (
              <div key={source.name} className="flex flex-col gap-1.5">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <div className="flex min-w-0 flex-wrap items-center gap-2">
                    <span
                      className="size-2 shrink-0 rounded-full"
                      style={{ backgroundColor: source.color }}
                      aria-hidden="true"
                    />
                    <span className="text-sm font-medium text-[rgba(23,20,15,0.85)]">{source.name}</span>
                    <span className="text-[11.5px] font-semibold" style={{ color: source.color }}>
                      {source.note}
                    </span>
                  </div>
                  <span className="shrink-0 font-mono text-sm font-semibold">${source.revenue.toLocaleString()}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-[3px] bg-[rgba(23,20,15,0.06)]">
                  <div className="h-full rounded-[3px]" style={{ width: `${share}%`, backgroundColor: source.color }} />
                </div>
                <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 font-mono text-[11.5px] text-[rgba(23,20,15,0.4)]">
                  <span className="break-all">{source.utm}</span>
                  <span className="shrink-0">spend ${source.spend.toLocaleString()} · {source.customers} customers</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </section>
  );
}
