// CRACKODH
import type { VehicleStatus } from "@/generated/prisma/client";

import { VEHICLE_STATUS_LABELS, type VehicleStatusValue } from "./constants";

export const MANUAL_VEHICLE_STATUSES: VehicleStatusValue[] = ["AVAILABLE", "RETIRED"];

export function getEditableVehicleStatusOptions(currentStatus: VehicleStatus) {
  if (currentStatus === "ON_TRIP" || currentStatus === "IN_SHOP") {
    return [
      {
        value: currentStatus,
        label: VEHICLE_STATUS_LABELS[currentStatus],
        locked: true,
      },
    ];
  }

  return MANUAL_VEHICLE_STATUSES.map((value) => ({
    value,
    label: VEHICLE_STATUS_LABELS[value],
    locked: false,
  }));
}

export function resolveVehicleStatusCreate(
  requestedStatus: VehicleStatus,
): { ok: true; status: VehicleStatus } | { ok: false; error: string } {
  if (requestedStatus === "ON_TRIP" || requestedStatus === "IN_SHOP") {
    return {
      ok: false,
      error: "On Trip and In Shop statuses are assigned automatically by trip dispatch and maintenance workflows.",
    };
  }

  return { ok: true, status: requestedStatus };
}

export function resolveVehicleStatusUpdate(
  currentStatus: VehicleStatus,
  requestedStatus: VehicleStatus,
): { ok: true; status: VehicleStatus } | { ok: false; error: string } {
  if (currentStatus === "ON_TRIP" || currentStatus === "IN_SHOP") {
    if (requestedStatus !== currentStatus) {
      return {
        ok: false,
        error: "Status is managed by trips or maintenance workflows and cannot be changed manually.",
      };
    }

    return { ok: true, status: currentStatus };
  }

  if (requestedStatus === "ON_TRIP" || requestedStatus === "IN_SHOP") {
    return {
      ok: false,
      error: "On Trip and In Shop statuses are assigned automatically by trip dispatch and maintenance workflows.",
    };
  }

  return { ok: true, status: requestedStatus };
}
