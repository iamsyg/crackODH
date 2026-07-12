// CRACKODH
import { DriverStatus, TripStatus, VehicleStatus } from "@/generated/prisma/client";

import { prisma } from "@/lib/prisma";

import {
  validateActiveTripConflict,
  validateCargoCapacity,
  validateDriverAvailableForDispatch,
  validateDriverForTripAssignment,
  validateVehicleAvailableForDispatch,
  validateVehicleForTripAssignment,
} from "./rules";

type DispatchValidationInput = {
  vehicleId: string;
  driverId: string;
  cargoWeight: number;
  excludeTripId?: string;
};

const activeTripFilter = (excludeTripId?: string) => ({
  status: { in: [TripStatus.DRAFT, TripStatus.DISPATCHED] as TripStatus[] },
  ...(excludeTripId ? { id: { not: excludeTripId } } : {}),
});

export async function validateTripDispatch(input: DispatchValidationInput) {
  const [vehicle, driver] = await Promise.all([
    prisma.vehicle.findUnique({ where: { id: input.vehicleId } }),
    prisma.driver.findUnique({ where: { id: input.driverId } }),
  ]);

  if (!vehicle) return { ok: false as const, error: "Selected vehicle was not found." };
  if (!driver) return { ok: false as const, error: "Selected driver was not found." };

  const vehicleAssignment = validateVehicleForTripAssignment(vehicle.status);
  if (!vehicleAssignment.ok) return vehicleAssignment;

  const cargoCheck = validateCargoCapacity(input.cargoWeight, Number(vehicle.maxLoadCapacity));
  if (!cargoCheck.ok) return cargoCheck;

  const driverAssignment = validateDriverForTripAssignment(
    driver.status,
    driver.licenseExpiryDate.toISOString(),
  );
  if (!driverAssignment.ok) return driverAssignment;

  const filter = activeTripFilter(input.excludeTripId);
  const [vehicleConflict, driverConflict] = await Promise.all([
    prisma.trip.findFirst({
      where: { vehicleId: input.vehicleId, ...filter },
    }),
    prisma.trip.findFirst({
      where: { driverId: input.driverId, ...filter },
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

  const vehicleConflictCheck = validateActiveTripConflict(Boolean(vehicleConflict), "vehicle", "dispatch");
  if (!vehicleConflictCheck.ok) return vehicleConflictCheck;

  const driverConflictCheck = validateActiveTripConflict(Boolean(driverConflict), "driver", "dispatch");
  if (!driverConflictCheck.ok) return driverConflictCheck;

  const vehicleAvailability = validateVehicleAvailableForDispatch(vehicle.status);
  if (!vehicleAvailability.ok) return vehicleAvailability;

  const driverAvailability = validateDriverAvailableForDispatch(driver.status);
  if (!driverAvailability.ok) return driverAvailability;

  return { ok: true as const, vehicle, driver };
}

export async function validateDraftAssignment(input: DispatchValidationInput) {
  const [vehicle, driver] = await Promise.all([
    prisma.vehicle.findUnique({ where: { id: input.vehicleId } }),
    prisma.driver.findUnique({ where: { id: input.driverId } }),
  ]);

  if (!vehicle) return { ok: false as const, error: "Selected vehicle was not found." };
  if (!driver) return { ok: false as const, error: "Selected driver was not found." };

  const vehicleAssignment = validateVehicleForTripAssignment(vehicle.status);
  if (!vehicleAssignment.ok) return vehicleAssignment;

  const cargoCheck = validateCargoCapacity(input.cargoWeight, Number(vehicle.maxLoadCapacity));
  if (!cargoCheck.ok) return cargoCheck;

  const driverAssignment = validateDriverForTripAssignment(
    driver.status,
    driver.licenseExpiryDate.toISOString(),
  );
  if (!driverAssignment.ok) return driverAssignment;

  const filter = activeTripFilter(input.excludeTripId);
  const [vehicleConflict, driverConflict] = await Promise.all([
    prisma.trip.findFirst({
      where: { vehicleId: input.vehicleId, ...filter },
    }),
    prisma.trip.findFirst({
      where: { driverId: input.driverId, ...filter },
    }),
  ]);

  const vehicleConflictCheck = validateActiveTripConflict(Boolean(vehicleConflict), "vehicle", "draft");
  if (!vehicleConflictCheck.ok) return vehicleConflictCheck;

  const driverConflictCheck = validateActiveTripConflict(Boolean(driverConflict), "driver", "draft");
  if (!driverConflictCheck.ok) return driverConflictCheck;

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
