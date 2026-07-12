// CRACKODH
import Link from "next/link";

import { DriverFilters } from "@/components/drivers/driver-filters";
import { DriverTable } from "@/components/drivers/driver-table";
import { PageShell } from "@/components/layout/page-shell";
import { buttonVariants } from "@/components/ui/button";
import { requireAuth } from "@/lib/auth/require-permission";
import { getDriverFilterOptions, listDrivers } from "@/lib/drivers/queries";
import { driverFilterSchema } from "@/lib/drivers/schema";
import { hasPermission } from "@/lib/rbac";
import { cn } from "@/lib/utils";

type DriversPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function DriversPage({ searchParams }: DriversPageProps) {
  const session = await requireAuth();
  const canWrite = hasPermission(session.user.role, "drivers:write");

  const rawParams = await searchParams;
  const parsedFilters = driverFilterSchema.safeParse({
    q: typeof rawParams.q === "string" ? rawParams.q : undefined,
    status: typeof rawParams.status === "string" ? rawParams.status : undefined,
    licenseCategory:
      typeof rawParams.licenseCategory === "string" ? rawParams.licenseCategory : undefined,
    compliance: typeof rawParams.compliance === "string" ? rawParams.compliance : undefined,
  });

  const filters = parsedFilters.success ? parsedFilters.data : {};
  const [drivers, filterOptions] = await Promise.all([
    listDrivers(filters),
    getDriverFilterOptions(),
  ]);

  const notice =
    typeof rawParams.notice === "string" && rawParams.notice === "archived"
      ? "Driver has trip history and was marked Off Duty instead of deleted."
      : null;

  return (
    <PageShell
      title="Driver management"
      description="Track driver profiles, license validity, safety scores, and assignment eligibility."
      actions={
        canWrite ? (
          <Link className={cn(buttonVariants())} href="/drivers/new">
            Add driver
          </Link>
        ) : undefined
      }
    >
      {notice ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          {notice}
        </p>
      ) : null}

      <DriverFilters filters={filters} licenseCategories={filterOptions.licenseCategories} />
      <DriverTable canWrite={canWrite} drivers={drivers} />
    </PageShell>
  );
}
