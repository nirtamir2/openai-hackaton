interface Props {
  label?: string;
}

export function AiGeneratedBadge({ label = "AI GENERATED" }: Props) {
  return (
    <span className="inline-flex items-center rounded-[6px] bg-[#f3e8ff] px-2 py-0.5 font-mono text-[10px] font-semibold tracking-[0.3px] text-[#9333ea] uppercase">
      {label}
    </span>
  );
}
