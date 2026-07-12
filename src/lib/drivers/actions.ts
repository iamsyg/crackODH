// CRACKODH
"use server";

import { DriverStatus, Prisma } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requirePermission } from "@/lib/auth/require-permission";
import { prisma } from "@/lib/prisma";

import { parseDriverForm } from "./schema";

export type DriverActionState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

function formatActionError(error: unknown): DriverActionState {
  if (error instanceof Error) return { error: error.message };
  return { error: "Something went wrong. Please try again." };
}

export async function createDriver(
  _prevState: DriverActionState,
  formData: FormData,
): Promise<DriverActionState> {
  await requirePermission("drivers:write");

  const parsed = parseDriverForm(formData);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;

  try {
    await prisma.driver.create({
      data: {
        name: data.name,
        licenseNumber: data.licenseNumber.toUpperCase(),
        licenseCategory: data.licenseCategory,
        licenseExpiryDate: data.licenseExpiryDate,
        contactNumber: data.contactNumber,
        safetyScore: data.safetyScore,
        status: data.status,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { error: "A driver with this license number already exists." };
    }
    return formatActionError(error);
  }

  revalidatePath("/drivers");
  redirect("/drivers");
}

export async function updateDriver(
  driverId: string,
  _prevState: DriverActionState,
  formData: FormData,
): Promise<DriverActionState> {
  await requirePermission("drivers:write");

  const parsed = parseDriverForm(formData);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;

  try {
    await prisma.driver.update({
      where: { id: driverId },
      data: {
        name: data.name,
        licenseNumber: data.licenseNumber.toUpperCase(),
        licenseCategory: data.licenseCategory,
        licenseExpiryDate: data.licenseExpiryDate,
        contactNumber: data.contactNumber,
        safetyScore: data.safetyScore,
        status: data.status,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { error: "A driver with this license number already exists." };
    }
    return formatActionError(error);
  }

  revalidatePath("/drivers");
  revalidatePath(`/drivers/${driverId}/edit`);
  redirect("/drivers");
}

export async function deleteDriver(driverId: string): Promise<DriverActionState> {
  await requirePermission("drivers:write");

  const driver = await prisma.driver.findUnique({
    where: { id: driverId },
    include: { _count: { select: { trips: true } } },
  });

  if (!driver) {
    return { error: "Driver not found." };
  }

  if (driver.status === DriverStatus.ON_TRIP) {
    return { error: "Cannot delete a driver who is currently on a trip." };
  }

  if (driver._count.trips > 0) {
    await prisma.driver.update({
      where: { id: driverId },
      data: { status: DriverStatus.OFF_DUTY },
    });
    revalidatePath("/drivers");
    redirect("/drivers?notice=archived");
  }

  try {
    await prisma.driver.delete({ where: { id: driverId } });
  } catch (error) {
    return formatActionError(error);
  }

  revalidatePath("/drivers");
  redirect("/drivers");
}
