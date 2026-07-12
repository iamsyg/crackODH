// CRACKODH
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { PageShell } from "@/components/layout/page-shell";
import { TripForm } from "@/components/trips/trip-form";
import { buttonVariants } from "@/components/ui/button";
import { assertAssignedTripAccess, canManageTrips } from "@/lib/auth/trip-access";
import { requireAuth } from "@/lib/auth/require-permission";
import { updateTrip } from "@/lib/trips/actions";
import { getTripById, getTripFormContext } from "@/lib/trips/queries";
import { hasPermission } from "@/lib/rbac";
import { cn } from "@/lib/utils";

type EditTripPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditTripPage({ params }: EditTripPageProps) {
  const session = await requireAuth();
  if (!hasPermission(session.user.role, "trips:write") || !canManageTrips(session.user.role)) {
    redirect("/trips");
  }

  const { id } = await params;
  const tripAccess = await assertAssignedTripAccess(session.user, id);
  if (!tripAccess.ok) redirect("/trips");

  const [trip, options] = await Promise.all([getTripById(id), getTripFormContext(id)]);

  if (!trip) notFound();
  if (trip.status !== "DRAFT") redirect("/trips");

  const boundUpdateTrip = updateTrip.bind(null, id);

  return (
    <PageShell
      title="Edit trip"
      description={`Update draft ${trip.reference}.`}
      actions={
        <Link className={cn(buttonVariants({ variant: "outline" }))} href="/trips">
          Back to list
        </Link>
      }
    >
      <TripForm
        action={boundUpdateTrip}
        drivers={options.drivers}
        submitLabel="Save draft"
        trip={trip}
        vehicles={options.vehicles}
      />
    </PageShell>
  );
}
