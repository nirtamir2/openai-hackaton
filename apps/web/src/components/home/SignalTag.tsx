import type { SignalAccent } from "@/components/home/signalTheme";
import { getSignalAccentColor } from "@/components/home/signalTheme";

interface Props {
  label: string;
  accent: SignalAccent;
}

export function SignalTag({ label, accent }: Props) {
  const color = getSignalAccentColor({ accent });

  return (
    <span
      className="inline-flex items-center rounded-[6px] px-2 py-0.5 font-mono text-[11px] font-semibold tracking-[0.3px]"
      style={{
        color,
        backgroundColor: `${color}1a`,
      }}
    >
      {label}
    </span>
  );
}
