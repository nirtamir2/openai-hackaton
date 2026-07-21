import {
  MarketingTaskContentType,
  MarketingTaskNetwork,
} from "@app-template/db/enums";
import {
  getMarketingTaskNetworkColor,
  getMarketingTaskNetworkColorBg,
  getMarketingTaskTag,
} from "@app-template/db/marketingTaskBrand";

interface Props {
  contentType: MarketingTaskContentType;
  network: MarketingTaskNetwork;
}

export function TaskTypeBadge({ contentType, network }: Props) {
  const color = getMarketingTaskNetworkColor({ network });
  const colorBg = getMarketingTaskNetworkColorBg({ network });
  const label = getMarketingTaskTag({ network, contentType });

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 font-mono text-[10px] font-semibold tracking-[0.3px]"
      style={{ color, backgroundColor: colorBg }}
    >
      <span className="inline-block size-[5px] rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}
