import { MarketingTaskType } from "@app-template/db/enums";
import { Badge } from "@/components/ui/Badge";

interface Props {
  taskType: MarketingTaskType;
}

export function TaskDurationBadge({ taskType }: Props) {
  if (taskType === MarketingTaskType.LONG) {
    return <Badge variant="outline">Idea</Badge>;
  }

  return <Badge variant="secondary">Short task</Badge>;
}
