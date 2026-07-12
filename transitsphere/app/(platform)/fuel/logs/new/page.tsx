// CRACKODH
import Link from "next/link";
import { redirect } from "next/navigation";

import { FuelForm } from "@/components/fuel/fuel-form";
import { PageShell } from "@/components/layout/page-shell";
import { buttonVariants } from "@/components/ui/button";
import { requireAuth } from "@/lib/auth/require-permission";
import { createFuelLog } from "@/lib/fuel/actions";
import { getFuelTripOptions, getFuelVehicleOptions } from "@/lib/fuel/queries";
import { hasPermission } from "@/lib/rbac";
import { cn } from "@/lib/utils";

export default async function NewFuelLogPage() {
  const session = await requireAuth();
  if (!hasPermission(session.user.role, "fuel:write")) {
    redirect("/fuel");
  }

  const [vehicles, trips] = await Promise.all([getFuelVehicleOptions(), getFuelTripOptions()]);

  return (
    <PageShell
      title="Log fuel"
      description="Record fuel consumption and cost for a vehicle."
      actions={
        <Link className={cn(buttonVariants({ variant: "outline" }))} href="/fuel">
          Back to list
        </Link>
      }
    >
      <FuelForm action={createFuelLog} submitLabel="Create fuel log" trips={trips} vehicles={vehicles} />
    </PageShell>
  );
}
