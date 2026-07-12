// CRACKODH
import Link from "next/link";

import { MaintenanceFilters } from "@/components/maintenance/maintenance-filters";
import { MaintenanceTable } from "@/components/maintenance/maintenance-table";
import { PageShell } from "@/components/layout/page-shell";
import { buttonVariants } from "@/components/ui/button";
import { requireAuth } from "@/lib/auth/require-permission";
import { listMaintenanceLogs } from "@/lib/maintenance/queries";
import { maintenanceFilterSchema } from "@/lib/maintenance/schema";
import { hasPermission } from "@/lib/rbac";
import { cn } from "@/lib/utils";

const NOTICE_MESSAGES: Record<string, string> = {
  opened: "Maintenance opened. Vehicle is now In Shop.",
  closed: "Maintenance closed. Vehicle returned to Available.",
};

type MaintenancePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function MaintenancePage({ searchParams }: MaintenancePageProps) {
  const session = await requireAuth();
  const canWrite = hasPermission(session.user.role, "maintenance:write");

  const rawParams = await searchParams;
  const parsedFilters = maintenanceFilterSchema.safeParse({
    q: typeof rawParams.q === "string" ? rawParams.q : undefined,
    status: typeof rawParams.status === "string" ? rawParams.status : undefined,
  });

  const filters = parsedFilters.success ? parsedFilters.data : {};
  const logs = await listMaintenanceLogs(filters);

  const noticeKey = typeof rawParams.notice === "string" ? rawParams.notice : null;
  const notice = noticeKey ? NOTICE_MESSAGES[noticeKey] : null;

  return (
    <PageShell
      title="Maintenance"
      description="Log maintenance work and automatically move vehicles in and out of shop status."
      actions={
        canWrite ? (
          <Link className={cn(buttonVariants())} href="/maintenance/new">
            Log maintenance
          </Link>
        ) : undefined
      }
    >
      {notice ? (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {notice}
        </p>
      ) : null}

      <MaintenanceFilters filters={filters} />
      <MaintenanceTable canWrite={canWrite} logs={logs} />
    </PageShell>
  );
}
