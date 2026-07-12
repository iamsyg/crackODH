// CRACKODH
"use server";

import { Prisma, VehicleStatus } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requirePermission } from "@/lib/auth/require-permission";
import { prisma } from "@/lib/prisma";

import { parseVehicleForm } from "./schema";

export type VehicleActionState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

function formatActionError(error: unknown): VehicleActionState {
  if (error instanceof Error) return { error: error.message };
  return { error: "Something went wrong. Please try again." };
}

export async function createVehicle(
  _prevState: VehicleActionState,
  formData: FormData,
): Promise<VehicleActionState> {
  await requirePermission("vehicles:write");

  const parsed = parseVehicleForm(formData);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;

  try {
    await prisma.vehicle.create({
      data: {
        registrationNumber: data.registrationNumber.toUpperCase(),
        name: data.name,
        model: data.model || null,
        type: data.type,
        maxLoadCapacity: data.maxLoadCapacity,
        odometer: data.odometer,
        acquisitionCost: data.acquisitionCost,
        status: data.status,
        region: data.region || null,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { error: "A vehicle with this registration number already exists." };
    }
    return formatActionError(error);
  }

  revalidatePath("/vehicles");
  redirect("/vehicles");
}

export async function updateVehicle(
  vehicleId: string,
  _prevState: VehicleActionState,
  formData: FormData,
): Promise<VehicleActionState> {
  await requirePermission("vehicles:write");

  const parsed = parseVehicleForm(formData);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;

  try {
    await prisma.vehicle.update({
      where: { id: vehicleId },
      data: {
        registrationNumber: data.registrationNumber.toUpperCase(),
        name: data.name,
        model: data.model || null,
        type: data.type,
        maxLoadCapacity: data.maxLoadCapacity,
        odometer: data.odometer,
        acquisitionCost: data.acquisitionCost,
        status: data.status,
        region: data.region || null,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { error: "A vehicle with this registration number already exists." };
    }
    return formatActionError(error);
  }

  revalidatePath("/vehicles");
  revalidatePath(`/vehicles/${vehicleId}/edit`);
  redirect("/vehicles");
}

export async function deleteVehicle(vehicleId: string): Promise<VehicleActionState> {
  await requirePermission("vehicles:write");

  const vehicle = await prisma.vehicle.findUnique({
    where: { id: vehicleId },
    include: {
      _count: { select: { trips: true, maintenanceLogs: true } },
    },
  });

  if (!vehicle) {
    return { error: "Vehicle not found." };
  }

  if (vehicle.status === VehicleStatus.ON_TRIP) {
    return { error: "Cannot delete a vehicle that is currently on a trip." };
  }

  if (vehicle._count.trips > 0 || vehicle._count.maintenanceLogs > 0) {
    await prisma.vehicle.update({
      where: { id: vehicleId },
      data: { status: VehicleStatus.RETIRED },
    });
    revalidatePath("/vehicles");
    redirect("/vehicles?notice=retired");
  }

  try {
    await prisma.vehicle.delete({ where: { id: vehicleId } });
  } catch (error) {
    return formatActionError(error);
  }

  revalidatePath("/vehicles");
  redirect("/vehicles");
}
