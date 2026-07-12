import Link from "next/link";
import { redirect } from "next/navigation";

import { PageShell } from "@/components/layout/page-shell";
import { TripForm } from "@/components/trips/trip-form";
import { buttonVariants } from "@/components/ui/button";
import { requireAuth } from "@/lib/auth/require-permission";
import { createTrip } from "@/lib/trips/actions";
import { getTripFormContext } from "@/lib/trips/queries";
import { hasPermission } from "@/lib/rbac";
import { cn } from "@/lib/utils";

export default async function NewTripPage() {
  const session = await requireAuth();
  if (!hasPermission(session.user.role, "trips:write")) {
    redirect("/trips");
  }

  const options = await getTripFormContext();

  return (
    <PageShell
      title="Create trip"
      description="Plan a new trip with source, destination, vehicle, driver, cargo, and distance."
      actions={
        <Link className={cn(buttonVariants({ variant: "outline" }))} href="/trips">
          Back to list
        </Link>
      }
    >
      <TripForm
        action={createTrip}
        drivers={options.drivers}
        submitLabel="Create draft trip"
        vehicles={options.vehicles}
      />
    </PageShell>
  );
}
