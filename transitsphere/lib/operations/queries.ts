// CRACKODH
import { prisma } from "@/lib/prisma";

export async function listFuelLogs() {
  return prisma.fuelLog.findMany({
    include: {
      vehicle: { select: { registrationNumber: true, name: true } },
      trip: { select: { reference: true } },
    },
    orderBy: { loggedAt: "desc" },
  });
}

export async function listExpenses() {
  return prisma.expense.findMany({
    include: {
      vehicle: { select: { registrationNumber: true, name: true } },
      trip: { select: { reference: true } },
    },
    orderBy: { incurredAt: "desc" },
  });
}
