// CRACKODH
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireActionPermission } from "@/lib/auth/require-permission";
import { prisma } from "@/lib/prisma";

import { parseFuelForm } from "./schema";

export type FuelActionState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

function formatActionError(error: unknown): FuelActionState {
  if (error instanceof Error) return { error: error.message };
  return { error: "Something went wrong. Please try again." };
}

async function validateTripLink(tripId: string | undefined, vehicleId: string) {
  if (!tripId) return null;

  const trip = await prisma.trip.findUnique({ where: { id: tripId } });
  if (!trip) return "Linked trip not found.";
  if (trip.vehicleId !== vehicleId) {
    return "The selected trip does not belong to this vehicle.";
  }

  return null;
}

export async function createFuelLog(
  _prevState: FuelActionState,
  formData: FormData,
): Promise<FuelActionState> {
  const access = await requireActionPermission("fuel:write");
  if (!access.ok) return { error: access.error };

  const parsed = parseFuelForm(formData);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;
  const vehicle = await prisma.vehicle.findUnique({ where: { id: data.vehicleId } });
  if (!vehicle) return { error: "Vehicle not found." };
  if (vehicle.status === "RETIRED") {
    return { error: "Fuel logs cannot be added to retired vehicles." };
  }

  const tripError = await validateTripLink(data.tripId, data.vehicleId);
  if (tripError) return { error: tripError };

  try {
    await prisma.fuelLog.create({
      data: {
        vehicleId: data.vehicleId,
        tripId: data.tripId ?? null,
        liters: data.liters,
        cost: data.cost,
        odometer: data.odometer ?? null,
        loggedAt: data.loggedAt,
      },
    });
  } catch (error) {
    return formatActionError(error);
  }

  revalidatePath("/fuel");
  revalidatePath("/reports");
  revalidatePath("/dashboard");
  redirect("/fuel");
}

export async function updateFuelLog(
  fuelLogId: string,
  _prevState: FuelActionState,
  formData: FormData,
): Promise<FuelActionState> {
  const access = await requireActionPermission("fuel:write");
  if (!access.ok) return { error: access.error };

  const existing = await prisma.fuelLog.findUnique({ where: { id: fuelLogId } });
  if (!existing) return { error: "Fuel log not found." };

  const parsed = parseFuelForm(formData);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;
  const vehicle = await prisma.vehicle.findUnique({ where: { id: data.vehicleId } });
  if (!vehicle) return { error: "Vehicle not found." };

  const tripError = await validateTripLink(data.tripId, data.vehicleId);
  if (tripError) return { error: tripError };

  try {
    await prisma.fuelLog.update({
      where: { id: fuelLogId },
      data: {
        vehicleId: data.vehicleId,
        tripId: data.tripId ?? null,
        liters: data.liters,
        cost: data.cost,
        odometer: data.odometer ?? null,
        loggedAt: data.loggedAt,
      },
    });
  } catch (error) {
    return formatActionError(error);
  }

  revalidatePath("/fuel");
  revalidatePath(`/fuel/logs/${fuelLogId}/edit`);
  revalidatePath("/reports");
  revalidatePath("/dashboard");
  redirect("/fuel");
}

export async function deleteFuelLog(fuelLogId: string): Promise<FuelActionState> {
  const access = await requireActionPermission("fuel:write");
  if (!access.ok) return { error: access.error };

  const existing = await prisma.fuelLog.findUnique({ where: { id: fuelLogId } });
  if (!existing) return { error: "Fuel log not found." };

  try {
    await prisma.fuelLog.delete({ where: { id: fuelLogId } });
  } catch (error) {
    return formatActionError(error);
  }

  revalidatePath("/fuel");
  revalidatePath("/reports");
  revalidatePath("/dashboard");
  redirect("/fuel");
}
