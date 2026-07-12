// CRACKODH
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { DriverForm } from "@/components/drivers/driver-form";
import { PageShell } from "@/components/layout/page-shell";
import { buttonVariants } from "@/components/ui/button";
import { requireAuth } from "@/lib/auth/require-permission";
import { updateDriver } from "@/lib/drivers/actions";
import { getDriverById } from "@/lib/drivers/queries";
import { hasPermission } from "@/lib/rbac";
import { cn } from "@/lib/utils";

type EditDriverPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditDriverPage({ params }: EditDriverPageProps) {
  const session = await requireAuth();
  if (!hasPermission(session.user.role, "drivers:write")) {
    redirect("/drivers");
  }

  const { id } = await params;
  const driver = await getDriverById(id);
  if (!driver) notFound();

  const boundUpdateDriver = updateDriver.bind(null, id);

  return (
    <PageShell
      title="Edit driver"
      description={`Update profile for ${driver.name}.`}
      actions={
        <Link className={cn(buttonVariants({ variant: "outline" }))} href="/drivers">
          Back to list
        </Link>
      }
    >
      <DriverForm action={boundUpdateDriver} driver={driver} submitLabel="Save changes" />
    </PageShell>
  );
}
