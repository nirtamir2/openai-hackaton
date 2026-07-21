import { MarketingTaskType } from "@app-template/db/enums";
import { Badge } from "@/components/ui/Badge";

interface Props {
  taskType: MarketingTaskType;
}

export function TaskTypeBadge({ taskType }: Props) {
  if (taskType === MarketingTaskType.LONG) {
    return <Badge variant="outline">Long-term</Badge>;
  }

  return <Badge variant="secondary">Short-term</Badge>;
}
