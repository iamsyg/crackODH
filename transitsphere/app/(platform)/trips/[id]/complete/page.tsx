// CRACKODH
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { CompleteTripForm } from "@/components/trips/complete-trip-form";
import { PageShell } from "@/components/layout/page-shell";
import { buttonVariants } from "@/components/ui/button";
import { assertAssignedTripAccess } from "@/lib/auth/trip-access";
import { requireAuth } from "@/lib/auth/require-permission";
import { completeTrip } from "@/lib/trips/actions";
import { getTripById } from "@/lib/trips/queries";
import { hasPermission } from "@/lib/rbac";
import { cn } from "@/lib/utils";

type CompleteTripPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CompleteTripPage({ params }: CompleteTripPageProps) {
  const session = await requireAuth();
  if (!hasPermission(session.user.role, "trips:write")) {
    redirect("/trips");
  }

  const { id } = await params;
  const tripAccess = await assertAssignedTripAccess(session.user, id);
  if (!tripAccess.ok) redirect("/trips");

  const trip = await getTripById(id);

  if (!trip) notFound();
  if (trip.status !== "DISPATCHED") redirect("/trips");

  const boundCompleteTrip = completeTrip.bind(null, id);

  return (
    <PageShell
      title="Complete trip"
      description="Record final odometer, actual distance, and fuel consumed."
      actions={
        <Link className={cn(buttonVariants({ variant: "outline" }))} href="/trips">
          Back to list
        </Link>
      }
    >
      <CompleteTripForm action={boundCompleteTrip} trip={trip} />
    </PageShell>
  );
}
