import type { VehicleStatusValue } from "@/lib/vehicles/constants";
import { Badge } from "@/components/ui/badge";
import { VEHICLE_STATUS_LABELS } from "@/lib/vehicles/constants";

const statusVariants: Record<
  VehicleStatusValue,
  "success" | "warning" | "danger" | "muted"
> = {
  AVAILABLE: "success",
  ON_TRIP: "warning",
  IN_SHOP: "danger",
  RETIRED: "muted",
};

export function VehicleStatusBadge({ status }: { status: VehicleStatusValue }) {
  return <Badge variant={statusVariants[status]}>{VEHICLE_STATUS_LABELS[status]}</Badge>;
}
