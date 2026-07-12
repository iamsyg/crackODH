import type { MaintenanceStatus } from "@/generated/prisma/client";
import { VehicleStatus } from "@/generated/prisma/client";

import { prisma } from "@/lib/prisma";

import type { MaintenanceFilterInput } from "./schema";
import { serializeMaintenanceLog, type SerializedMaintenanceLog } from "./serialize";

export async function listMaintenanceLogs(
  filters: MaintenanceFilterInput = {},
): Promise<SerializedMaintenanceLog[]> {
  const logs = await prisma.maintenanceLog.findMany({
    where: {
      ...(filters.status ? { status: filters.status as MaintenanceStatus } : {}),
      ...(filters.q
        ? {
            OR: [
              { description: { contains: filters.q, mode: "insensitive" } },
              { vehicle: { registrationNumber: { contains: filters.q, mode: "insensitive" } } },
              { vehicle: { name: { contains: filters.q, mode: "insensitive" } } },
            ],
          }
        : {}),
    },
    include: {
      vehicle: { select: { registrationNumber: true, name: true } },
    },
    orderBy: [{ status: "asc" }, { openedAt: "desc" }],
  });

  return logs.map(serializeMaintenanceLog);
}

export async function getMaintenanceById(id: string) {
  const log = await prisma.maintenanceLog.findUnique({
    where: { id },
    include: { vehicle: { select: { registrationNumber: true, name: true } } },
  });

  return log ? serializeMaintenanceLog(log) : null;
}

export async function getMaintenanceVehicleOptions() {
  const vehicles = await prisma.vehicle.findMany({
    where: {
      status: { not: VehicleStatus.RETIRED },
    },
    orderBy: { registrationNumber: "asc" },
  });

  return vehicles.map((vehicle) => ({
    id: vehicle.id,
    label: `${vehicle.registrationNumber} — ${vehicle.name}`,
    meta: vehicle.status,
  }));
}
