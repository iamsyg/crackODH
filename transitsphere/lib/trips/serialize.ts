// CRACKODH
import type { Trip } from "@/generated/prisma/client";

import type { TripStatusValue } from "./constants";

export type SerializedTrip = {
  id: string;
  reference: string;
  source: string;
  destination: string;
  vehicleId: string;
  vehicleRegistration: string;
  vehicleName: string;
  driverId: string;
  driverName: string;
  cargoWeight: number;
  plannedDistance: number;
  actualDistance: number | null;
  finalOdometer: number | null;
  revenue: number | null;
  status: TripStatusValue;
  dispatchedAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type TripWithRelations = Trip & {
  vehicle: { registrationNumber: string; name: string };
  driver: { name: string };
};

export function serializeTrip(trip: TripWithRelations): SerializedTrip {
  return {
    id: trip.id,
    reference: trip.reference,
    source: trip.source,
    destination: trip.destination,
    vehicleId: trip.vehicleId,
    vehicleRegistration: trip.vehicle.registrationNumber,
    vehicleName: trip.vehicle.name,
    driverId: trip.driverId,
    driverName: trip.driver.name,
    cargoWeight: Number(trip.cargoWeight),
    plannedDistance: Number(trip.plannedDistance),
    actualDistance: trip.actualDistance ? Number(trip.actualDistance) : null,
    finalOdometer: trip.finalOdometer ? Number(trip.finalOdometer) : null,
    revenue: trip.revenue ? Number(trip.revenue) : null,
    status: trip.status,
    dispatchedAt: trip.dispatchedAt?.toISOString() ?? null,
    completedAt: trip.completedAt?.toISOString() ?? null,
    cancelledAt: trip.cancelledAt?.toISOString() ?? null,
    createdAt: trip.createdAt.toISOString(),
    updatedAt: trip.updatedAt.toISOString(),
  };
}

export type DispatchOption = {
  id: string;
  label: string;
  meta: string;
};

export function toVehicleOption(vehicle: {
  id: string;
  registrationNumber: string;
  name: string;
  maxLoadCapacity: { toString(): string };
}) {
  return {
    id: vehicle.id,
    label: `${vehicle.registrationNumber} — ${vehicle.name}`,
    meta: `${Number(vehicle.maxLoadCapacity)} kg capacity`,
  };
}

export function toDriverOption(driver: { id: string; name: string; licenseNumber: string }) {
  return {
    id: driver.id,
    label: driver.name,
    meta: driver.licenseNumber,
  };
}
