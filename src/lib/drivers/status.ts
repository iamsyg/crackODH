// CRACKODH
import type { DriverStatus } from "@/generated/prisma/client";

import { DRIVER_STATUS_LABELS, type DriverStatusValue } from "./constants";

export const MANUAL_DRIVER_STATUSES: DriverStatusValue[] = ["AVAILABLE", "OFF_DUTY", "SUSPENDED"];

export function getEditableDriverStatusOptions(currentStatus: DriverStatus) {
  if (currentStatus === "ON_TRIP") {
    return [
      {
        value: currentStatus,
        label: DRIVER_STATUS_LABELS[currentStatus],
        locked: true,
      },
    ];
  }

  return MANUAL_DRIVER_STATUSES.map((value) => ({
    value,
    label: DRIVER_STATUS_LABELS[value],
    locked: false,
  }));
}

export function resolveDriverStatusCreate(
  requestedStatus: DriverStatus,
): { ok: true; status: DriverStatus } | { ok: false; error: string } {
  if (requestedStatus === "ON_TRIP") {
    return {
      ok: false,
      error: "On Trip status is assigned automatically when a trip is dispatched.",
    };
  }

  return { ok: true, status: requestedStatus };
}

export function resolveDriverStatusUpdate(
  currentStatus: DriverStatus,
  requestedStatus: DriverStatus,
): { ok: true; status: DriverStatus } | { ok: false; error: string } {
  if (currentStatus === "ON_TRIP") {
    if (requestedStatus !== currentStatus) {
      return {
        ok: false,
        error: "Status is managed by trip workflows and cannot be changed while the driver is on a trip.",
      };
    }

    return { ok: true, status: currentStatus };
  }

  if (requestedStatus === "ON_TRIP") {
    return {
      ok: false,
      error: "On Trip status is assigned automatically when a trip is dispatched.",
    };
  }

  return { ok: true, status: requestedStatus };
}
