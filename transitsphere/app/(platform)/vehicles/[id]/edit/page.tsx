// CRACKODH
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { PageShell } from "@/components/layout/page-shell";
import { VehicleForm } from "@/components/vehicles/vehicle-form";
import { buttonVariants } from "@/components/ui/button";
import { requireAuth } from "@/lib/auth/require-permission";
import { hasPermission } from "@/lib/rbac";
import { updateVehicle } from "@/lib/vehicles/actions";
import { getVehicleById } from "@/lib/vehicles/queries";
import { getEditableVehicleStatusOptions } from "@/lib/vehicles/status";
import { cn } from "@/lib/utils";

type EditVehiclePageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditVehiclePage({ params }: EditVehiclePageProps) {
  const session = await requireAuth();
  if (!hasPermission(session.user.role, "vehicles:write")) {
    redirect("/vehicles");
  }

  const { id } = await params;
  const vehicle = await getVehicleById(id);
  if (!vehicle) notFound();

  const boundUpdateVehicle = updateVehicle.bind(null, id);

  return (
    <PageShell
      title="Edit vehicle"
      description={`Update details for ${vehicle.registrationNumber}.`}
      actions={
        <Link className={cn(buttonVariants({ variant: "outline" }))} href="/vehicles">
          Back to list
        </Link>
      }
    >
      <VehicleForm
        action={boundUpdateVehicle}
        statusOptions={getEditableVehicleStatusOptions(vehicle.status)}
        submitLabel="Save changes"
        vehicle={vehicle}
      />
    </PageShell>
  );
}
