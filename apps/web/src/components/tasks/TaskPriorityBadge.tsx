import { Badge } from "@/components/ui/Badge";

interface Props {
  priority: number;
}

const priorityLabels: Record<number, string> = {
  1: "Critical",
  2: "High",
  3: "Medium",
  4: "Low",
  5: "Minimal",
};

function getPriorityVariant(priority: number) {
  if (priority <= 2) {
    return "destructive" as const;
  }

  if (priority === 3) {
    return "default" as const;
  }

  return "secondary" as const;
}

export function TaskPriorityBadge({ priority }: Props) {
  const label = priorityLabels[priority] ?? `P${String(priority)}`;

  return <Badge variant={getPriorityVariant(priority)}>{label}</Badge>;
}
