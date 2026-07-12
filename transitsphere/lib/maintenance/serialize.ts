// CRACKODH
import type { MaintenanceLog } from "@/generated/prisma/client";

export type SerializedMaintenanceLog = {
  id: string;
  vehicleId: string;
  vehicleRegistration: string;
  vehicleName: string;
  description: string;
  status: "OPEN" | "CLOSED";
  cost: number;
  openedAt: string;
  closedAt: string | null;
};

type MaintenanceWithVehicle = MaintenanceLog & {
  vehicle: { registrationNumber: string; name: string };
};

export function serializeMaintenanceLog(log: MaintenanceWithVehicle): SerializedMaintenanceLog {
  return {
    id: log.id,
    vehicleId: log.vehicleId,
    vehicleRegistration: log.vehicle.registrationNumber,
    vehicleName: log.vehicle.name,
    description: log.description,
    status: log.status,
    cost: Number(log.cost),
    openedAt: log.openedAt.toISOString(),
    closedAt: log.closedAt?.toISOString() ?? null,
  };
}
