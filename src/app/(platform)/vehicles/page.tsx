import Link from "next/link";
import { redirect } from "next/navigation";

import { PageShell } from "@/components/layout/page-shell";
import { VehicleFilters } from "@/components/vehicles/vehicle-filters";
import { VehicleTable } from "@/components/vehicles/vehicle-table";
import { buttonVariants } from "@/components/ui/button";
import { requireAuth } from "@/lib/auth/require-permission";
import { hasPermission } from "@/lib/rbac";
import { getVehicleFilterOptions, listVehicles } from "@/lib/vehicles/queries";
import { vehicleFilterSchema } from "@/lib/vehicles/schema";
import { cn } from "@/lib/utils";

type VehiclesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function VehiclesPage({ searchParams }: VehiclesPageProps) {
  const session = await requireAuth();
  const canWrite = hasPermission(session.user.role, "vehicles:write");

  const rawParams = await searchParams;
  const parsedFilters = vehicleFilterSchema.safeParse({
    q: typeof rawParams.q === "string" ? rawParams.q : undefined,
    type: typeof rawParams.type === "string" ? rawParams.type : undefined,
    status: typeof rawParams.status === "string" ? rawParams.status : undefined,
    region: typeof rawParams.region === "string" ? rawParams.region : undefined,
  });

  const filters = parsedFilters.success ? parsedFilters.data : {};
  const [vehicles, filterOptions] = await Promise.all([
    listVehicles(filters),
    getVehicleFilterOptions(),
  ]);

  const notice =
    typeof rawParams.notice === "string" && rawParams.notice === "retired"
      ? "Vehicle has operational history and was marked Retired instead of deleted."
      : null;

  return (
    <PageShell
      title="Vehicle registry"
      description="Maintain fleet assets with registration details, capacity, odometer, and status."
      actions={
        canWrite ? (
          <Link className={cn(buttonVariants())} href="/vehicles/new">
            Add vehicle
          </Link>
        ) : undefined
      }
    >
      {notice ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          {notice}
        </p>
      ) : null}

      <VehicleFilters filters={filters} regions={filterOptions.regions} types={filterOptions.types} />

      <VehicleTable canWrite={canWrite} vehicles={vehicles} />
    </PageShell>
  );
}
