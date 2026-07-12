import type { Vehicle } from "@/generated/prisma/client";

export type SerializedVehicle = {
  id: string;
  registrationNumber: string;
  name: string;
  model: string | null;
  type: string;
  maxLoadCapacity: number;
  odometer: number;
  acquisitionCost: number;
  status: Vehicle["status"];
  region: string | null;
  createdAt: string;
  updatedAt: string;
};

export function serializeVehicle(vehicle: Vehicle): SerializedVehicle {
  return {
    id: vehicle.id,
    registrationNumber: vehicle.registrationNumber,
    name: vehicle.name,
    model: vehicle.model,
    type: vehicle.type,
    maxLoadCapacity: Number(vehicle.maxLoadCapacity),
    odometer: Number(vehicle.odometer),
    acquisitionCost: Number(vehicle.acquisitionCost),
    status: vehicle.status,
    region: vehicle.region,
    createdAt: vehicle.createdAt.toISOString(),
    updatedAt: vehicle.updatedAt.toISOString(),
  };
}
