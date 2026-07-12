// CRACKODH
import { z } from "zod";

export const dashboardFilterSchema = z.object({
  q: z.string().trim().optional(),
  type: z.string().trim().optional(),
  status: z.enum(["AVAILABLE", "ON_TRIP", "IN_SHOP", "RETIRED"]).optional(),
  region: z.string().trim().optional(),
});

export type DashboardFilterInput = z.infer<typeof dashboardFilterSchema>;

export type DashboardMetrics = {
  activeVehicles: number;
  availableVehicles: number;
  vehiclesInMaintenance: number;
  activeTrips: number;
  pendingTrips: number;
  driversOnDuty: number;
  fleetUtilization: number;
  tripsByStatus: { status: string; count: number }[];
  vehiclesByStatus: { status: string; count: number }[];
};

function buildFleetWhere(filters: DashboardFilterInput) {
  return {
    ...(filters.q
      ? {
          OR: [
            { registrationNumber: { contains: filters.q, mode: "insensitive" as const } },
            { name: { contains: filters.q, mode: "insensitive" as const } },
            { model: { contains: filters.q, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...(filters.type ? { type: filters.type } : {}),
    ...(filters.region ? { region: filters.region } : {}),
    ...(filters.status ? { status: filters.status } : { status: { not: "RETIRED" as const } }),
  };
}

export async function getDashboardMetrics(
  filters: DashboardFilterInput = {},
): Promise<DashboardMetrics> {
  const { prisma } = await import("@/lib/prisma");

  const fleetWhere = buildFleetWhere(filters);
  const scopedWhere = fleetWhere;
  const hasVehicleScope = Boolean(filters.q || filters.type || filters.region || filters.status);
  const tripScope = hasVehicleScope ? { vehicle: scopedWhere } : {};

  const [
    activeVehicles,
    availableVehicles,
    vehiclesInMaintenance,
    activeTrips,
    pendingTrips,
    driversOnDuty,
    onTripVehicles,
    tripGroups,
    vehicleGroups,
  ] = await Promise.all([
    prisma.vehicle.count({ where: fleetWhere }),
    prisma.vehicle.count({
      where: { ...scopedWhere, status: "AVAILABLE" },
    }),
    prisma.vehicle.count({
      where: { ...scopedWhere, status: "IN_SHOP" },
    }),
    prisma.trip.count({ where: { status: "DISPATCHED", ...tripScope } }),
    prisma.trip.count({ where: { status: "DRAFT", ...tripScope } }),
    prisma.driver.count({
      where: {
        status: "ON_TRIP",
        ...(hasVehicleScope
          ? {
              trips: {
                some: {
                  status: "DISPATCHED",
                  vehicle: scopedWhere,
                },
              },
            }
          : {}),
      },
    }),
    prisma.vehicle.count({
      where: { ...scopedWhere, status: "ON_TRIP" },
    }),
    prisma.trip.groupBy({
      by: ["status"],
      where: tripScope,
      _count: { _all: true },
    }),
    prisma.vehicle.groupBy({
      by: ["status"],
      where: scopedWhere,
      _count: { _all: true },
    }),
  ]);

  const fleetUtilization =
    activeVehicles > 0 ? Math.round((onTripVehicles / activeVehicles) * 100) : 0;

  return {
    activeVehicles,
    availableVehicles,
    vehiclesInMaintenance,
    activeTrips,
    pendingTrips,
    driversOnDuty,
    fleetUtilization,
    tripsByStatus: tripGroups.map((group) => ({
      status: group.status,
      count: group._count._all,
    })),
    vehiclesByStatus: vehicleGroups.map((group) => ({
      status: group.status,
      count: group._count._all,
    })),
  };
}

export async function getDashboardFilterOptions() {
  const { prisma } = await import("@/lib/prisma");

  const [types, regions] = await Promise.all([
    prisma.vehicle.findMany({
      distinct: ["type"],
      select: { type: true },
      orderBy: { type: "asc" },
    }),
    prisma.vehicle.findMany({
      where: { region: { not: null } },
      distinct: ["region"],
      select: { region: true },
      orderBy: { region: "asc" },
    }),
  ]);

  return {
    types: types.map((entry) => entry.type),
    regions: regions.map((entry) => entry.region).filter((region): region is string => Boolean(region)),
  };
}
