// CRACKODH
import Link from "next/link";
import { redirect } from "next/navigation";

import { MaintenanceForm } from "@/components/maintenance/maintenance-form";
import { PageShell } from "@/components/layout/page-shell";
import { buttonVariants } from "@/components/ui/button";
import { requireAuth } from "@/lib/auth/require-permission";
import { createMaintenanceLog } from "@/lib/maintenance/actions";
import { getMaintenanceVehicleOptions } from "@/lib/maintenance/queries";
import { hasPermission } from "@/lib/rbac";
import { cn } from "@/lib/utils";

export default async function NewMaintenancePage() {
  const session = await requireAuth();
  if (!hasPermission(session.user.role, "maintenance:write")) {
    redirect("/maintenance");
  }

  const vehicles = await getMaintenanceVehicleOptions();
  const eligibleVehicles = vehicles.filter(
    (vehicle) => vehicle.meta !== "ON_TRIP" && vehicle.meta !== "IN_SHOP",
  );

  return (
    <PageShell
      title="Log maintenance"
      description="Create a maintenance record. The vehicle will automatically move to In Shop status."
      actions={
        <Link className={cn(buttonVariants({ variant: "outline" }))} href="/maintenance">
          Back to list
        </Link>
      }
    >
      <MaintenanceForm
        action={createMaintenanceLog}
        submitLabel="Open maintenance"
        vehicles={eligibleVehicles.length > 0 ? eligibleVehicles : vehicles}
      />
    </PageShell>
  );
}
