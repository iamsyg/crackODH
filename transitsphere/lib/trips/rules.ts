// CRACKODH
import type { DriverStatus, VehicleStatus } from "@/generated/prisma/client";

import { isLicenseEligible } from "@/lib/drivers/constants";

export function validateCargoCapacity(cargoWeight: number, maxLoadCapacity: number) {
  if (cargoWeight > maxLoadCapacity) {
    return {
      ok: false as const,
      error: `Cargo weight exceeds vehicle capacity (${maxLoadCapacity} kg).`,
    };
  }

  return { ok: true as const };
}

export function validateVehicleForTripAssignment(status: VehicleStatus) {
  if (status === "RETIRED" || status === "IN_SHOP") {
    return {
      ok: false as const,
      error: "Retired or in-shop vehicles cannot be assigned to trips.",
    };
  }

  return { ok: true as const };
}

export function validateDriverForTripAssignment(
  status: DriverStatus,
  licenseExpiryIso: string,
) {
  if (status === "SUSPENDED") {
    return { ok: false as const, error: "Suspended drivers cannot be assigned to trips." };
  }

  if (!isLicenseEligible(licenseExpiryIso, status)) {
    return {
      ok: false as const,
      error: "Driver license is expired or the driver is not eligible for dispatch.",
    };
  }

  return { ok: true as const };
}

export function validateVehicleAvailableForDispatch(status: VehicleStatus) {
  if (status !== "AVAILABLE") {
    return {
      ok: false as const,
      error: "Vehicle must be available before dispatch.",
    };
  }

  return { ok: true as const };
}

export function validateDriverAvailableForDispatch(status: DriverStatus) {
  if (status !== "AVAILABLE") {
    return {
      ok: false as const,
      error: "Driver must be available before dispatch.",
    };
  }

  return { ok: true as const };
}

export function validateActiveTripConflict(
  hasConflict: boolean,
  entity: "vehicle" | "driver",
  mode: "draft" | "dispatch",
) {
  if (!hasConflict) return { ok: true as const };

  if (mode === "draft") {
    return {
      ok: false as const,
      error: `This ${entity} already has another draft or dispatched trip.`,
    };
  }

  return {
    ok: false as const,
    error:
      entity === "vehicle"
        ? "This vehicle already has another draft or dispatched trip."
        : "This driver already has another draft or dispatched trip.",
  };
}
