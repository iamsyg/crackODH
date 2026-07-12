// CRACKODH
import Link from "next/link";
import { redirect } from "next/navigation";

import { DriverForm } from "@/components/drivers/driver-form";
import { PageShell } from "@/components/layout/page-shell";
import { buttonVariants } from "@/components/ui/button";
import { requireAuth } from "@/lib/auth/require-permission";
import { createDriver } from "@/lib/drivers/actions";
import { MANUAL_DRIVER_STATUSES } from "@/lib/drivers/status";
import { DRIVER_STATUS_LABELS } from "@/lib/drivers/constants";
import { hasPermission } from "@/lib/rbac";
import { cn } from "@/lib/utils";

export default async function NewDriverPage() {
  const session = await requireAuth();
  if (!hasPermission(session.user.role, "drivers:write")) {
    redirect("/drivers");
  }

  return (
    <PageShell
      title="Add driver"
      description="Register a driver profile with license details, contact info, and safety score."
      actions={
        <Link className={cn(buttonVariants({ variant: "outline" }))} href="/drivers">
          Back to list
        </Link>
      }
    >
      <DriverForm
        action={createDriver}
        statusOptions={MANUAL_DRIVER_STATUSES.map((value) => ({
          value,
          label: DRIVER_STATUS_LABELS[value],
        }))}
        submitLabel="Create driver"
      />
    </PageShell>
  );
}
