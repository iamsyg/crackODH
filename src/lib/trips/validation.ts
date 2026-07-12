// CRACKODH
import { DriverStatus, TripStatus, VehicleStatus } from "@/generated/prisma/client";

import { isLicenseEligible } from "@/lib/drivers/constants";
import { prisma } from "@/lib/prisma";

type DispatchValidationInput = {
  vehicleId: string;
  driverId: string;
  cargoWeight: number;
  excludeTripId?: string;
};

export async function validateTripDispatch(input: DispatchValidationInput) {
  const [vehicle, driver] = await Promise.all([
    prisma.vehicle.findUnique({ where: { id: input.vehicleId } }),
    prisma.driver.findUnique({ where: { id: input.driverId } }),
  ]);

  if (!vehicle) return { ok: false as const, error: "Selected vehicle was not found." };
  if (!driver) return { ok: false as const, error: "Selected driver was not found." };

  if (vehicle.status === VehicleStatus.RETIRED || vehicle.status === VehicleStatus.IN_SHOP) {
    return {
      ok: false as const,
      error: "Retired or in-shop vehicles cannot be assigned to trips.",
    };
  }

  if (Number(input.cargoWeight) > Number(vehicle.maxLoadCapacity)) {
    return {
      ok: false as const,
      error: `Cargo weight exceeds vehicle capacity (${Number(vehicle.maxLoadCapacity)} kg).`,
    };
  }

  if (driver.status === DriverStatus.SUSPENDED) {
    return { ok: false as const, error: "Suspended drivers cannot be assigned to trips." };
  }

  if (!isLicenseEligible(driver.licenseExpiryDate.toISOString(), driver.status)) {
    return {
      ok: false as const,
      error: "Driver license is expired or the driver is not eligible for dispatch.",
    };
  }

  const activeTripFilter = {
    status: { in: [TripStatus.DRAFT, TripStatus.DISPATCHED] as TripStatus[] },
    ...(input.excludeTripId ? { id: { not: input.excludeTripId } } : {}),
  };

  const [vehicleConflict, driverConflict] = await Promise.all([
    prisma.trip.findFirst({
      where: { vehicleId: input.vehicleId, ...activeTripFilter },
    }),
    prisma.trip.findFirst({
      where: { driverId: input.driverId, ...activeTripFilter },
    }),
  ]);

  if (vehicle.status === VehicleStatus.ON_TRIP && vehicleConflict) {
    return {
      ok: false as const,
      error: "This vehicle is already assigned to another active trip.",
    };
  }

  if (driver.status === DriverStatus.ON_TRIP && driverConflict) {
    return {
      ok: false as const,
      error: "This driver is already assigned to another active trip.",
    };
  }

  if (vehicleConflict && vehicleConflict.id !== input.excludeTripId) {
    return {
      ok: false as const,
      error: "This vehicle already has another draft or dispatched trip.",
    };
  }

  if (driverConflict && driverConflict.id !== input.excludeTripId) {
    return {
      ok: false as const,
      error: "This driver already has another draft or dispatched trip.",
    };
  }

  if (vehicle.status !== VehicleStatus.AVAILABLE) {
    return {
      ok: false as const,
      error: "Vehicle must be available before dispatch.",
    };
  }

  if (driver.status !== DriverStatus.AVAILABLE) {
    return {
      ok: false as const,
      error: "Driver must be available before dispatch.",
    };
  }

  return { ok: true as const, vehicle, driver };
}

export async function validateDraftAssignment(input: DispatchValidationInput) {
  const [vehicle, driver] = await Promise.all([
    prisma.vehicle.findUnique({ where: { id: input.vehicleId } }),
    prisma.driver.findUnique({ where: { id: input.driverId } }),
  ]);

  if (!vehicle) return { ok: false as const, error: "Selected vehicle was not found." };
  if (!driver) return { ok: false as const, error: "Selected driver was not found." };

  if (vehicle.status === VehicleStatus.RETIRED || vehicle.status === VehicleStatus.IN_SHOP) {
    return {
      ok: false as const,
      error: "Retired or in-shop vehicles cannot be selected for trips.",
    };
  }

  if (Number(input.cargoWeight) > Number(vehicle.maxLoadCapacity)) {
    return {
      ok: false as const,
      error: `Cargo weight exceeds vehicle capacity (${Number(vehicle.maxLoadCapacity)} kg).`,
    };
  }

  if (driver.status === DriverStatus.SUSPENDED) {
    return { ok: false as const, error: "Suspended drivers cannot be assigned to trips." };
  }

  if (!isLicenseEligible(driver.licenseExpiryDate.toISOString(), driver.status)) {
    return {
      ok: false as const,
      error: "Driver license is expired or the driver is not eligible.",
    };
  }

  const activeTripFilter = {
    status: { in: [TripStatus.DRAFT, TripStatus.DISPATCHED] as TripStatus[] },
    ...(input.excludeTripId ? { id: { not: input.excludeTripId } } : {}),
  };

  const [vehicleConflict, driverConflict] = await Promise.all([
    prisma.trip.findFirst({
      where: { vehicleId: input.vehicleId, ...activeTripFilter },
    }),
    prisma.trip.findFirst({
      where: { driverId: input.driverId, ...activeTripFilter },
    }),
  ]);

  if (vehicleConflict) {
    return {
      ok: false as const,
      error: "This vehicle already has another draft or dispatched trip.",
    };
  }

  if (driverConflict) {
    return {
      ok: false as const,
      error: "This driver already has another draft or dispatched trip.",
    };
  }

  return { ok: true as const, vehicle, driver };
}

async function generateTripReference() {
  const latest = await prisma.trip.findFirst({
    orderBy: { createdAt: "desc" },
    select: { reference: true },
  });

  const latestNumber = latest?.reference.match(/TRIP-(\d+)/)?.[1];
  const nextNumber = latestNumber ? Number(latestNumber) + 1 : 1001;
  return `TRIP-${nextNumber}`;
}

export { generateTripReference };
