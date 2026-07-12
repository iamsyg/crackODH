// CRACKODH
import { Badge } from "@/components/ui/badge";
import type { TripStatusValue } from "@/lib/trips/constants";
import { TRIP_STATUS_LABELS } from "@/lib/trips/constants";

const statusVariants: Record<
  TripStatusValue,
  "default" | "warning" | "success" | "muted" | "danger"
> = {
  DRAFT: "muted",
  DISPATCHED: "warning",
  COMPLETED: "success",
  CANCELLED: "danger",
};

export function TripStatusBadge({ status }: { status: TripStatusValue }) {
  return <Badge variant={statusVariants[status]}>{TRIP_STATUS_LABELS[status]}</Badge>;
}
