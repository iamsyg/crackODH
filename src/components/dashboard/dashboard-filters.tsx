// CRACKODH
import Link from "next/link";

import { VEHICLE_STATUS_OPTIONS } from "@/lib/vehicles/constants";
import type { DashboardFilterInput } from "@/lib/dashboard/queries";

type DashboardFiltersProps = {
  filters: DashboardFilterInput;
  types: string[];
  regions: string[];
};

const selectClassName =
  "h-9 rounded-lg border border-input bg-background px-3 text-sm shadow-sm focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50";

export function DashboardFilters({ filters, types, regions }: DashboardFiltersProps) {
  return (
    <form action="/dashboard" className="grid gap-3 rounded-xl border border-border bg-card p-4 md:grid-cols-2 lg:grid-cols-4" method="get">
      <label className="grid gap-1.5 text-sm">
        <span className="font-medium">Vehicle type</span>
        <select className={selectClassName} defaultValue={filters.type ?? ""} name="type">
          <option value="">All types</option>
          {types.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-1.5 text-sm">
        <span className="font-medium">Vehicle status</span>
        <select className={selectClassName} defaultValue={filters.status ?? ""} name="status">
          <option value="">Active fleet</option>
          {VEHICLE_STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-1.5 text-sm">
        <span className="font-medium">Region</span>
        <select className={selectClassName} defaultValue={filters.region ?? ""} name="region">
          <option value="">All regions</option>
          {regions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
      </label>

      <div className="flex items-end gap-2">
        <button
          className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          type="submit"
        >
          Apply filters
        </button>
        <Link
          className="inline-flex h-9 items-center justify-center rounded-lg border border-border px-4 text-sm font-medium hover:bg-muted"
          href="/dashboard"
        >
          Clear
        </Link>
      </div>
    </form>
  );
}
