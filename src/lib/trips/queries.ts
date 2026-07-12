// CRACKODH
import type { TripStatus } from "@/generated/prisma/client";
import { DriverStatus, VehicleStatus } from "@/generated/prisma/client";

import { prisma } from "@/lib/prisma";

import type { TripFilterInput } from "./schema";
import {
  serializeTrip,
  toDriverOption,
  toVehicleOption,
  type DispatchOption,
  type SerializedTrip,
} from "./serialize";

export async function listTrips(
  filters: TripFilterInput = {},
  scope: { driverId?: string } = {},
): Promise<SerializedTrip[]> {
  const trips = await prisma.trip.findMany({
    where: {
      ...(scope.driverId ? { driverId: scope.driverId } : {}),
      ...(filters.status ? { status: filters.status as TripStatus } : {}),
      ...(filters.q
        ? {
            OR: [
              { reference: { contains: filters.q, mode: "insensitive" } },
              { source: { contains: filters.q, mode: "insensitive" } },
              { destination: { contains: filters.q, mode: "insensitive" } },
              { vehicle: { registrationNumber: { contains: filters.q, mode: "insensitive" } } },
              { driver: { name: { contains: filters.q, mode: "insensitive" } } },
            ],
          }
        : {}),
    },
    include: {
      vehicle: { select: { registrationNumber: true, name: true } },
      driver: { select: { name: true } },
    },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });

  return trips.map(serializeTrip);
}

export async function getTripById(id: string): Promise<SerializedTrip | null> {
  const trip = await prisma.trip.findUnique({
    where: { id },
    include: {
      vehicle: { select: { registrationNumber: true, name: true } },
      driver: { select: { name: true } },
    },
  });

  return trip ? serializeTrip(trip) : null;
}

export async function getAvailableDispatchOptions(): Promise<{
  vehicles: DispatchOption[];
  drivers: DispatchOption[];
}> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [vehicles, drivers] = await Promise.all([
    prisma.vehicle.findMany({
      where: { status: VehicleStatus.AVAILABLE },
      orderBy: { registrationNumber: "asc" },
    }),
    prisma.driver.findMany({
      where: {
        status: DriverStatus.AVAILABLE,
        licenseExpiryDate: { gte: today },
      },
      orderBy: { name: "asc" },
    }),
  ]);

  return {
    vehicles: vehicles.map(toVehicleOption),
    drivers: drivers.map(toDriverOption),
  };
}

export async function getDispatchOptions(): Promise<{
  vehicles: DispatchOption[];
  drivers: DispatchOption[];
}> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [vehicles, drivers] = await Promise.all([
    prisma.vehicle.findMany({
      where: {
        status: { in: [VehicleStatus.AVAILABLE, VehicleStatus.ON_TRIP] },
        NOT: { status: VehicleStatus.RETIRED },
      },
      orderBy: { registrationNumber: "asc" },
    }),
    prisma.driver.findMany({
      where: {
        status: { in: [DriverStatus.AVAILABLE, DriverStatus.ON_TRIP] },
        licenseExpiryDate: { gte: today },
        NOT: { status: DriverStatus.SUSPENDED },
      },
      orderBy: { name: "asc" },
    }),
  ]);

  const eligibleVehicles = vehicles.filter(
    (vehicle) => vehicle.status !== VehicleStatus.IN_SHOP && vehicle.status !== VehicleStatus.RETIRED,
  );

  const eligibleDrivers = drivers.filter((driver) => driver.status !== DriverStatus.SUSPENDED);

  return {
    vehicles: eligibleVehicles.map(toVehicleOption),
    drivers: eligibleDrivers.map(toDriverOption),
  };
}

export async function getTripFormContext(tripId?: string) {
  const options = tripId ? await getDispatchOptions() : await getAvailableDispatchOptions();

  if (!tripId) return options;

  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: { vehicle: true, driver: true },
  });

  if (!trip) return options;

  const vehicleIds = new Set(options.vehicles.map((item) => item.id));
  const driverIds = new Set(options.drivers.map((item) => item.id));

  if (!vehicleIds.has(trip.vehicleId)) {
    options.vehicles.push(toVehicleOption(trip.vehicle));
  }

  if (!driverIds.has(trip.driverId)) {
    options.drivers.push(toDriverOption(trip.driver));
  }

  return options;
}
