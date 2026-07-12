// CRACKODH
import { prisma } from "@/lib/prisma";

export async function getExpenseById(id: string) {
  return prisma.expense.findUnique({
    where: { id },
    include: {
      vehicle: { select: { registrationNumber: true, name: true } },
      trip: { select: { reference: true } },
    },
  });
}

export async function getExpenseVehicleOptions() {
  const vehicles = await prisma.vehicle.findMany({
    where: { status: { not: "RETIRED" } },
    orderBy: { registrationNumber: "asc" },
    select: {
      id: true,
      registrationNumber: true,
      name: true,
      status: true,
    },
  });

  return vehicles.map((vehicle) => ({
    id: vehicle.id,
    label: `${vehicle.registrationNumber} — ${vehicle.name}`,
    meta: vehicle.status,
  }));
}

export async function getExpenseTripOptions(vehicleId?: string) {
  return prisma.trip.findMany({
    where: {
      ...(vehicleId ? { vehicleId } : {}),
      status: { in: ["DISPATCHED", "COMPLETED"] },
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      reference: true,
      vehicleId: true,
    },
    take: 50,
  });
}
