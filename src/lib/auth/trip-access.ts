// CRACKODH
import { prisma } from "@/lib/prisma";
import type { TransitOpsRole } from "@/types/roles";

export async function getDriverIdForUser(userId: string) {
  const driver = await prisma.driver.findUnique({
    where: { userId },
    select: { id: true },
  });

  return driver?.id ?? null;
}

export async function getTripListScope(user: { id: string; role: TransitOpsRole }) {
  if (user.role !== "DRIVER") return {};

  const driverId = await getDriverIdForUser(user.id);
  return { driverId: driverId ?? "__unlinked__" };
}

export async function assertAssignedTripAccess(
  user: { id: string; role: TransitOpsRole },
  tripId: string,
) {
  const trip = await prisma.trip.findUnique({ where: { id: tripId } });
  if (!trip) {
    return { ok: false as const, error: "Trip not found." };
  }

  if (user.role !== "DRIVER") {
    return { ok: true as const, trip };
  }

  const driverId = await getDriverIdForUser(user.id);
  if (!driverId || trip.driverId !== driverId) {
    return { ok: false as const, error: "You can only access trips assigned to you." };
  }

  return { ok: true as const, trip };
}

export function canManageTrips(role: TransitOpsRole) {
  return role !== "DRIVER";
}
