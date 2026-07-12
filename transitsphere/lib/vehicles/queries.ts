// CRACKODH
import type { VehicleStatus } from "@/generated/prisma/client";

import { prisma } from "@/lib/prisma";

import { serializeVehicle, type SerializedVehicle } from "./serialize";
import type { VehicleFilterInput } from "./schema";

export async function listVehicles(filters: VehicleFilterInput = {}): Promise<SerializedVehicle[]> {
  const vehicles = await prisma.vehicle.findMany({
    where: {
      ...(filters.type ? { type: filters.type } : {}),
      ...(filters.status ? { status: filters.status as VehicleStatus } : {}),
      ...(filters.region ? { region: filters.region } : {}),
      ...(filters.q
        ? {
            OR: [
              { registrationNumber: { contains: filters.q, mode: "insensitive" } },
              { name: { contains: filters.q, mode: "insensitive" } },
              { model: { contains: filters.q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: [{ status: "asc" }, { name: "asc" }],
  });

  return vehicles.map(serializeVehicle);
}

export async function getVehicleById(id: string): Promise<SerializedVehicle | null> {
  const vehicle = await prisma.vehicle.findUnique({ where: { id } });
  return vehicle ? serializeVehicle(vehicle) : null;
}

export async function getVehicleFilterOptions() {
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
