// CRACKODH
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireActionPermission } from "@/lib/auth/require-permission";
import { prisma } from "@/lib/prisma";

import { parseExpenseForm } from "./schema";

export type ExpenseActionState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

function formatActionError(error: unknown): ExpenseActionState {
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

export async function createExpense(
  _prevState: ExpenseActionState,
  formData: FormData,
): Promise<ExpenseActionState> {
  const access = await requireActionPermission("fuel:write");
  if (!access.ok) return { error: access.error };

  const parsed = parseExpenseForm(formData);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;
  const vehicle = await prisma.vehicle.findUnique({ where: { id: data.vehicleId } });
  if (!vehicle) return { error: "Vehicle not found." };
  if (vehicle.status === "RETIRED") {
    return { error: "Expenses cannot be added to retired vehicles." };
  }

  const tripError = await validateTripLink(data.tripId, data.vehicleId);
  if (tripError) return { error: tripError };

  try {
    await prisma.expense.create({
      data: {
        vehicleId: data.vehicleId,
        tripId: data.tripId ?? null,
        category: data.category,
        amount: data.amount,
        note: data.note ?? null,
        incurredAt: data.incurredAt,
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

export async function updateExpense(
  expenseId: string,
  _prevState: ExpenseActionState,
  formData: FormData,
): Promise<ExpenseActionState> {
  const access = await requireActionPermission("fuel:write");
  if (!access.ok) return { error: access.error };

  const existing = await prisma.expense.findUnique({ where: { id: expenseId } });
  if (!existing) return { error: "Expense not found." };

  const parsed = parseExpenseForm(formData);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;
  const vehicle = await prisma.vehicle.findUnique({ where: { id: data.vehicleId } });
  if (!vehicle) return { error: "Vehicle not found." };

  const tripError = await validateTripLink(data.tripId, data.vehicleId);
  if (tripError) return { error: tripError };

  try {
    await prisma.expense.update({
      where: { id: expenseId },
      data: {
        vehicleId: data.vehicleId,
        tripId: data.tripId ?? null,
        category: data.category,
        amount: data.amount,
        note: data.note ?? null,
        incurredAt: data.incurredAt,
      },
    });
  } catch (error) {
    return formatActionError(error);
  }

  revalidatePath("/fuel");
  revalidatePath(`/fuel/expenses/${expenseId}/edit`);
  revalidatePath("/reports");
  revalidatePath("/dashboard");
  redirect("/fuel");
}

export async function deleteExpense(expenseId: string): Promise<ExpenseActionState> {
  const access = await requireActionPermission("fuel:write");
  if (!access.ok) return { error: access.error };

  const existing = await prisma.expense.findUnique({ where: { id: expenseId } });
  if (!existing) return { error: "Expense not found." };

  try {
    await prisma.expense.delete({ where: { id: expenseId } });
  } catch (error) {
    return formatActionError(error);
  }

  revalidatePath("/fuel");
  revalidatePath("/reports");
  revalidatePath("/dashboard");
  redirect("/fuel");
}
