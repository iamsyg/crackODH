import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { CloseMaintenanceForm } from "@/components/maintenance/close-maintenance-form";
import { PageShell } from "@/components/layout/page-shell";
import { buttonVariants } from "@/components/ui/button";
import { requireAuth } from "@/lib/auth/require-permission";
import { closeMaintenanceLog } from "@/lib/maintenance/actions";
import { getMaintenanceById } from "@/lib/maintenance/queries";
import { hasPermission } from "@/lib/rbac";
import { cn } from "@/lib/utils";

type CloseMaintenancePageProps = {
  params: Promise<{ id: string }>;
};

export default async function CloseMaintenancePage({ params }: CloseMaintenancePageProps) {
  const session = await requireAuth();
  if (!hasPermission(session.user.role, "maintenance:write")) {
    redirect("/maintenance");
  }

  const { id } = await params;
  const log = await getMaintenanceById(id);
  if (!log) notFound();
  if (log.status !== "OPEN") redirect("/maintenance");

  const boundClose = closeMaintenanceLog.bind(null, id);

  return (
    <PageShell
      title="Close maintenance"
      description="Record final cost and return the vehicle to Available status."
      actions={
        <Link className={cn(buttonVariants({ variant: "outline" }))} href="/maintenance">
          Back to list
        </Link>
      }
    >
      <CloseMaintenanceForm action={boundClose} log={log} />
    </PageShell>
  );
}
