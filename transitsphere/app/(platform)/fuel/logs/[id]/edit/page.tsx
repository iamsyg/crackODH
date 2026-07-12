// CRACKODH
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { FuelForm } from "@/components/fuel/fuel-form";
import { PageShell } from "@/components/layout/page-shell";
import { buttonVariants } from "@/components/ui/button";
import { requireAuth } from "@/lib/auth/require-permission";
import { updateFuelLog } from "@/lib/fuel/actions";
import { getFuelLogById, getFuelTripOptions, getFuelVehicleOptions } from "@/lib/fuel/queries";
import { hasPermission } from "@/lib/rbac";
import { cn } from "@/lib/utils";

type EditFuelLogPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditFuelLogPage({ params }: EditFuelLogPageProps) {
  const session = await requireAuth();
  if (!hasPermission(session.user.role, "fuel:write")) {
    redirect("/fuel");
  }

  const { id } = await params;
  const fuelLog = await getFuelLogById(id);
  if (!fuelLog) notFound();

  const [vehicles, trips] = await Promise.all([
    getFuelVehicleOptions(),
    getFuelTripOptions(fuelLog.vehicleId),
  ]);

  const boundUpdateFuelLog = updateFuelLog.bind(null, id);

  return (
    <PageShell
      title="Edit fuel log"
      description={`Update fuel record for ${fuelLog.vehicle.registrationNumber}.`}
      actions={
        <Link className={cn(buttonVariants({ variant: "outline" }))} href="/fuel">
          Back to list
        </Link>
      }
    >
      <FuelForm
        action={boundUpdateFuelLog}
        defaultValues={{
          vehicleId: fuelLog.vehicleId,
          tripId: fuelLog.tripId,
          liters: Number(fuelLog.liters),
          cost: Number(fuelLog.cost),
          odometer: fuelLog.odometer ? Number(fuelLog.odometer) : null,
          loggedAt: fuelLog.loggedAt,
        }}
        submitLabel="Save changes"
        trips={trips}
        vehicles={vehicles}
      />
    </PageShell>
  );
}
