import { Badge } from "@/components/ui/badge";
import type { DriverStatusValue } from "@/lib/drivers/constants";
import { DRIVER_STATUS_LABELS } from "@/lib/drivers/constants";

const statusVariants: Record<
  DriverStatusValue,
  "success" | "warning" | "danger" | "muted"
> = {
  AVAILABLE: "success",
  ON_TRIP: "warning",
  OFF_DUTY: "muted",
  SUSPENDED: "danger",
};

export function DriverStatusBadge({ status }: { status: DriverStatusValue }) {
  return <Badge variant={statusVariants[status]}>{DRIVER_STATUS_LABELS[status]}</Badge>;
}
