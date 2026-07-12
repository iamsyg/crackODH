// CRACKODH
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { MaintenanceForm } from "@/components/maintenance/maintenance-form";
import { PageShell } from "@/components/layout/page-shell";
import { buttonVariants } from "@/components/ui/button";
import { requireAuth } from "@/lib/auth/require-permission";
import { updateMaintenanceLog } from "@/lib/maintenance/actions";
import { getMaintenanceById } from "@/lib/maintenance/queries";
import { hasPermission } from "@/lib/rbac";
import { cn } from "@/lib/utils";

type EditMaintenancePageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditMaintenancePage({ params }: EditMaintenancePageProps) {
  const session = await requireAuth();
  if (!hasPermission(session.user.role, "maintenance:write")) {
    redirect("/maintenance");
  }

  const { id } = await params;
  const log = await getMaintenanceById(id);
  if (!log) notFound();
  if (log.status !== "OPEN") redirect("/maintenance");

  const boundUpdate = updateMaintenanceLog.bind(null, id);

  return (
    <PageShell
      title="Edit maintenance"
      description={`Update open maintenance for ${log.vehicleRegistration}.`}
      actions={
        <Link className={cn(buttonVariants({ variant: "outline" }))} href="/maintenance">
          Back to list
        </Link>
      }
    >
      <MaintenanceForm
        action={boundUpdate}
        defaultCost={log.cost}
        defaultDescription={log.description}
        defaultVehicleId={log.vehicleId}
        showVehicleSelect={false}
        submitLabel="Save changes"
        vehicles={[]}
      />
    </PageShell>
  );
}
