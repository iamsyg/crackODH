// CRACKODH
import Link from "next/link";
import { redirect } from "next/navigation";

import { PageShell } from "@/components/layout/page-shell";
import { VehicleForm } from "@/components/vehicles/vehicle-form";
import { buttonVariants } from "@/components/ui/button";
import { requireAuth } from "@/lib/auth/require-permission";
import { hasPermission } from "@/lib/rbac";
import { createVehicle } from "@/lib/vehicles/actions";
import { MANUAL_VEHICLE_STATUSES, getEditableVehicleStatusOptions } from "@/lib/vehicles/status";
import { VEHICLE_STATUS_LABELS } from "@/lib/vehicles/constants";
import { cn } from "@/lib/utils";

export default async function NewVehiclePage() {
  const session = await requireAuth();
  if (!hasPermission(session.user.role, "vehicles:write")) {
    redirect("/vehicles");
  }

  return (
    <PageShell
      title="Add vehicle"
      description="Register a new fleet asset with capacity, odometer, and acquisition details."
      actions={
        <Link className={cn(buttonVariants({ variant: "outline" }))} href="/vehicles">
          Back to list
        </Link>
      }
    >
      <VehicleForm
        action={createVehicle}
        statusOptions={MANUAL_VEHICLE_STATUSES.map((value) => ({
          value,
          label: VEHICLE_STATUS_LABELS[value],
        }))}
        submitLabel="Create vehicle"
      />
    </PageShell>
  );
}
