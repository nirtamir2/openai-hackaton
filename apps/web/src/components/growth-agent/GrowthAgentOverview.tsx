export function GrowthAgentOverview() {
  return (
    <div className="flex flex-col">
      <h1 className="mb-1.5 text-[26px] font-semibold tracking-[-0.3px]">Overview</h1>
      <p className="mb-7 text-sm text-[rgba(23,20,15,0.55)]">Last 30 days</p>

      <div className="rounded-[14px] border border-[rgba(23,20,15,0.1)] bg-white p-8">
        <p className="text-base font-medium text-[#17140f]">No revenue data yet</p>
        <p className="mt-2 text-sm text-[rgba(23,20,15,0.55)]">
          Connect Stripe, Mixpanel, or Meta Ads to see revenue, ad spend, and customer metrics here.
        </p>
      </div>
    </div>
  );
}
