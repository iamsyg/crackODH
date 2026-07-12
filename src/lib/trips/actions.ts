// CRACKODH
"use server";

import { DriverStatus, TripStatus, VehicleStatus } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { assertAssignedTripAccess, canManageTrips } from "@/lib/auth/trip-access";
import { requireActionPermission } from "@/lib/auth/require-permission";
import { prisma } from "@/lib/prisma";

import { parseCompleteTripForm, parseTripForm } from "./schema";
import { generateTripReference, validateDraftAssignment, validateTripDispatch } from "./validation";

export type TripActionState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

function formatActionError(error: unknown): TripActionState {
  if (error instanceof Error) return { error: error.message };
  return { error: "Something went wrong. Please try again." };
}

export async function createTrip(
  _prevState: TripActionState,
  formData: FormData,
): Promise<TripActionState> {
  const access = await requireActionPermission("trips:write");
  if (!access.ok) return { error: access.error };
  if (!canManageTrips(access.session.user.role)) {
    return { error: "Drivers cannot create trips." };
  }

  const parsed = parseTripForm(formData);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;
  const validation = await validateDraftAssignment({
    vehicleId: data.vehicleId,
    driverId: data.driverId,
    cargoWeight: data.cargoWeight,
  });

  if (!validation.ok) {
    return { error: validation.error };
  }

  try {
    await prisma.trip.create({
      data: {
        reference: await generateTripReference(),
        source: data.source,
        destination: data.destination,
        vehicleId: data.vehicleId,
        driverId: data.driverId,
        cargoWeight: data.cargoWeight,
        plannedDistance: data.plannedDistance,
        revenue: data.revenue ?? null,
        status: TripStatus.DRAFT,
      },
    });
  } catch (error) {
    return formatActionError(error);
  }

  revalidatePath("/trips");
  redirect("/trips");
}

export async function updateTrip(
  tripId: string,
  _prevState: TripActionState,
  formData: FormData,
): Promise<TripActionState> {
  const access = await requireActionPermission("trips:write");
  if (!access.ok) return { error: access.error };
  if (!canManageTrips(access.session.user.role)) {
    return { error: "Drivers cannot edit trips." };
  }

  const tripAccess = await assertAssignedTripAccess(access.session.user, tripId);
  if (!tripAccess.ok) return { error: tripAccess.error };

  const trip = tripAccess.trip;
  if (trip.status !== TripStatus.DRAFT) {
    return { error: "Only draft trips can be edited." };
  }

  const parsed = parseTripForm(formData);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;
  const validation = await validateDraftAssignment({
    vehicleId: data.vehicleId,
    driverId: data.driverId,
    cargoWeight: data.cargoWeight,
    excludeTripId: tripId,
  });

  if (!validation.ok) {
    return { error: validation.error };
  }

  try {
    await prisma.trip.update({
      where: { id: tripId },
      data: {
        source: data.source,
        destination: data.destination,
        vehicleId: data.vehicleId,
        driverId: data.driverId,
        cargoWeight: data.cargoWeight,
        plannedDistance: data.plannedDistance,
        revenue: data.revenue ?? null,
      },
    });
  } catch (error) {
    return formatActionError(error);
  }

  revalidatePath("/trips");
  revalidatePath(`/trips/${tripId}/edit`);
  redirect("/trips");
}

export async function dispatchTrip(tripId: string): Promise<TripActionState> {
  const access = await requireActionPermission("trips:write");
  if (!access.ok) return { error: access.error };
  if (!canManageTrips(access.session.user.role)) {
    return { error: "Drivers cannot dispatch trips." };
  }

  const tripAccess = await assertAssignedTripAccess(access.session.user, tripId);
  if (!tripAccess.ok) return { error: tripAccess.error };

  const trip = tripAccess.trip;
  if (trip.status !== TripStatus.DRAFT) {
    return { error: "Only draft trips can be dispatched." };
  }

  const validation = await validateTripDispatch({
    vehicleId: trip.vehicleId,
    driverId: trip.driverId,
    cargoWeight: Number(trip.cargoWeight),
    excludeTripId: tripId,
  });

  if (!validation.ok) {
    return { error: validation.error };
  }

  try {
    await prisma.$transaction([
      prisma.trip.update({
        where: { id: tripId },
        data: { status: TripStatus.DISPATCHED, dispatchedAt: new Date() },
      }),
      prisma.vehicle.update({
        where: { id: trip.vehicleId },
        data: { status: VehicleStatus.ON_TRIP },
      }),
      prisma.driver.update({
        where: { id: trip.driverId },
        data: { status: DriverStatus.ON_TRIP },
      }),
    ]);
  } catch (error) {
    return formatActionError(error);
  }

  revalidatePath("/trips");
  revalidatePath("/vehicles");
  revalidatePath("/drivers");
  redirect("/trips?notice=dispatched");
}

export async function completeTrip(
  tripId: string,
  _prevState: TripActionState,
  formData: FormData,
): Promise<TripActionState> {
  const access = await requireActionPermission("trips:write");
  if (!access.ok) return { error: access.error };

  const tripAccess = await assertAssignedTripAccess(access.session.user, tripId);
  if (!tripAccess.ok) return { error: tripAccess.error };

  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: { vehicle: true },
  });

  if (!trip) return { error: "Trip not found." };
  if (trip.status !== TripStatus.DISPATCHED) {
    return { error: "Only dispatched trips can be completed." };
  }

  const parsed = parseCompleteTripForm(formData);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;

  if (data.finalOdometer < Number(trip.vehicle.odometer)) {
    return { error: "Final odometer cannot be less than the vehicle's current odometer." };
  }

  try {
    await prisma.$transaction([
      prisma.trip.update({
        where: { id: tripId },
        data: {
          status: TripStatus.COMPLETED,
          completedAt: new Date(),
          actualDistance: data.actualDistance,
          finalOdometer: data.finalOdometer,
          revenue: data.revenue ?? trip.revenue,
        },
      }),
      prisma.vehicle.update({
        where: { id: trip.vehicleId },
        data: { status: VehicleStatus.AVAILABLE, odometer: data.finalOdometer },
      }),
      prisma.driver.update({
        where: { id: trip.driverId },
        data: { status: DriverStatus.AVAILABLE },
      }),
      prisma.fuelLog.create({
        data: {
          vehicleId: trip.vehicleId,
          tripId: trip.id,
          liters: data.fuelLiters,
          cost: data.fuelCost,
          odometer: data.finalOdometer,
          loggedAt: new Date(),
        },
      }),
    ]);
  } catch (error) {
    return formatActionError(error);
  }

  revalidatePath("/trips");
  revalidatePath("/vehicles");
  revalidatePath("/drivers");
  revalidatePath("/fuel");
  redirect("/trips?notice=completed");
}

export async function cancelTrip(tripId: string): Promise<TripActionState> {
  const access = await requireActionPermission("trips:write");
  if (!access.ok) return { error: access.error };
  if (!canManageTrips(access.session.user.role)) {
    return { error: "Drivers cannot cancel trips." };
  }

  const tripAccess = await assertAssignedTripAccess(access.session.user, tripId);
  if (!tripAccess.ok) return { error: tripAccess.error };

  const trip = tripAccess.trip;

  if (trip.status !== TripStatus.DRAFT && trip.status !== TripStatus.DISPATCHED) {
    return { error: "Only draft or dispatched trips can be cancelled." };
  }

  const now = new Date();

  try {
    if (trip.status === TripStatus.DISPATCHED) {
      await prisma.$transaction([
        prisma.trip.update({
          where: { id: tripId },
          data: { status: TripStatus.CANCELLED, cancelledAt: now },
        }),
        prisma.vehicle.update({
          where: { id: trip.vehicleId },
          data: { status: VehicleStatus.AVAILABLE },
        }),
        prisma.driver.update({
          where: { id: trip.driverId },
          data: { status: DriverStatus.AVAILABLE },
        }),
      ]);
    } else {
      await prisma.trip.update({
        where: { id: tripId },
        data: { status: TripStatus.CANCELLED, cancelledAt: now },
      });
    }
  } catch (error) {
    return formatActionError(error);
  }

  revalidatePath("/trips");
  revalidatePath("/vehicles");
  revalidatePath("/drivers");
  redirect("/trips?notice=cancelled");
}

export async function deleteTrip(tripId: string): Promise<TripActionState> {
  const access = await requireActionPermission("trips:write");
  if (!access.ok) return { error: access.error };
  if (!canManageTrips(access.session.user.role)) {
    return { error: "Drivers cannot delete trips." };
  }

  const tripAccess = await assertAssignedTripAccess(access.session.user, tripId);
  if (!tripAccess.ok) return { error: tripAccess.error };

  const trip = tripAccess.trip;
  if (trip.status !== TripStatus.DRAFT) {
    return { error: "Only draft trips can be deleted." };
  }

  try {
    await prisma.trip.delete({ where: { id: tripId } });
  } catch (error) {
    return formatActionError(error);
  }

  revalidatePath("/trips");
  redirect("/trips");
}
