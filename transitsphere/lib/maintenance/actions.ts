// CRACKODH
"use server";

import { MaintenanceStatus, TripStatus, VehicleStatus } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireActionPermission } from "@/lib/auth/require-permission";
import { prisma } from "@/lib/prisma";

import { parseCloseMaintenanceForm, parseMaintenanceForm } from "./schema";

export type MaintenanceActionState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

function formatActionError(error: unknown): MaintenanceActionState {
  if (error instanceof Error) return { error: error.message };
  return { error: "Something went wrong. Please try again." };
}

export async function createMaintenanceLog(
  _prevState: MaintenanceActionState,
  formData: FormData,
): Promise<MaintenanceActionState> {
  const access = await requireActionPermission("maintenance:write");
  if (!access.ok) return { error: access.error };

  const parsed = parseMaintenanceForm(formData);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;
  const vehicle = await prisma.vehicle.findUnique({ where: { id: data.vehicleId } });

  if (!vehicle) return { error: "Vehicle not found." };
  if (vehicle.status === VehicleStatus.RETIRED) {
    return { error: "Retired vehicles cannot enter maintenance." };
  }
  if (vehicle.status === VehicleStatus.ON_TRIP) {
    return { error: "Vehicles on an active trip cannot enter maintenance." };
  }

  const existingOpen = await prisma.maintenanceLog.findFirst({
    where: { vehicleId: data.vehicleId, status: MaintenanceStatus.OPEN },
  });

  if (existingOpen) {
    return { error: "This vehicle already has an open maintenance record." };
  }

  try {
    await prisma.$transaction([
      prisma.maintenanceLog.create({
        data: {
          vehicleId: data.vehicleId,
          description: data.description,
          cost: data.cost ?? 0,
          status: MaintenanceStatus.OPEN,
        },
      }),
      prisma.vehicle.update({
        where: { id: data.vehicleId },
        data: { status: VehicleStatus.IN_SHOP },
      }),
    ]);
  } catch (error) {
    return formatActionError(error);
  }

  revalidatePath("/maintenance");
  revalidatePath("/vehicles");
  revalidatePath("/dashboard");
  redirect("/maintenance?notice=opened");
}

export async function closeMaintenanceLog(
  logId: string,
  _prevState: MaintenanceActionState,
  formData: FormData,
): Promise<MaintenanceActionState> {
  const access = await requireActionPermission("maintenance:write");
  if (!access.ok) return { error: access.error };

  const parsed = parseCloseMaintenanceForm(formData);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const log = await prisma.maintenanceLog.findUnique({ where: { id: logId } });
  if (!log) return { error: "Maintenance record not found." };
  if (log.status !== MaintenanceStatus.OPEN) {
    return { error: "Only open maintenance records can be closed." };
  }

  const activeTrip = await prisma.trip.findFirst({
    where: {
      vehicleId: log.vehicleId,
      status: { in: [TripStatus.DRAFT, TripStatus.DISPATCHED] },
    },
  });

  if (activeTrip) {
    return { error: "Cannot close maintenance while the vehicle has an active trip." };
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.maintenanceLog.update({
        where: { id: logId },
        data: {
          status: MaintenanceStatus.CLOSED,
          closedAt: new Date(),
          cost: parsed.data.cost,
        },
      });

      const vehicle = await tx.vehicle.findUnique({ where: { id: log.vehicleId } });
      if (vehicle && vehicle.status !== VehicleStatus.RETIRED) {
        await tx.vehicle.update({
          where: { id: log.vehicleId },
          data: { status: VehicleStatus.AVAILABLE },
        });
      }
    });
  } catch (error) {
    return formatActionError(error);
  }

  revalidatePath("/maintenance");
  revalidatePath("/vehicles");
  revalidatePath("/dashboard");
  redirect("/maintenance?notice=closed");
}

export async function updateMaintenanceLog(
  logId: string,
  _prevState: MaintenanceActionState,
  formData: FormData,
): Promise<MaintenanceActionState> {
  const access = await requireActionPermission("maintenance:write");
  if (!access.ok) return { error: access.error };

  const log = await prisma.maintenanceLog.findUnique({ where: { id: logId } });
  if (!log) return { error: "Maintenance record not found." };
  if (log.status !== MaintenanceStatus.OPEN) {
    return { error: "Only open maintenance records can be edited." };
  }

  const parsed = parseMaintenanceForm(formData);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    await prisma.maintenanceLog.update({
      where: { id: logId },
      data: {
        description: parsed.data.description,
        cost: parsed.data.cost ?? 0,
      },
    });
  } catch (error) {
    return formatActionError(error);
  }

  revalidatePath("/maintenance");
  revalidatePath(`/maintenance/${logId}/edit`);
  redirect("/maintenance");
}
