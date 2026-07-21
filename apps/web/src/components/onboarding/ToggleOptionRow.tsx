import type { SelectableOption } from "@/components/onboarding/onboardingTypes";
import { Switch } from "@/components/ui/Switch";

interface Props {
  option: SelectableOption;
  isEnabled: boolean;
  onChange: (enabled: boolean) => void;
}

export function ToggleOptionRow({ option, isEnabled, onChange }: Props) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[12px] border border-[rgba(23,20,15,0.12)] bg-white px-4 py-3.5">
      <label htmlFor={`channel-${option.id}`} className="flex min-w-0 flex-col gap-0.5">
        <span className="text-sm font-medium text-[#17140f]">{option.title}</span>
        <span className="text-sm text-[rgba(23,20,15,0.55)]">{option.subtitle}</span>
      </label>

      <Switch
        id={`channel-${option.id}`}
        checked={isEnabled}
        onCheckedChange={onChange}
      />
    </div>
  );
}
