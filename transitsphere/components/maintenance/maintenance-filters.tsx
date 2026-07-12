// CRACKODH
import Link from "next/link";

import type { MaintenanceFilterInput } from "@/lib/maintenance/schema";

type MaintenanceFiltersProps = {
  filters: MaintenanceFilterInput;
};

const selectClassName =
  "h-9 rounded-lg border border-input bg-background px-3 text-sm shadow-sm focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50";

export function MaintenanceFilters({ filters }: MaintenanceFiltersProps) {
  return (
    <form action="/maintenance" className="grid gap-3 rounded-xl border border-border bg-card p-4 md:grid-cols-3" method="get">
      <label className="grid gap-1.5 text-sm md:col-span-2">
        <span className="font-medium">Search</span>
        <input
          className={selectClassName}
          defaultValue={filters.q ?? ""}
          name="q"
          placeholder="Vehicle or description"
          type="search"
        />
      </label>

      <label className="grid gap-1.5 text-sm">
        <span className="font-medium">Status</span>
        <select className={selectClassName} defaultValue={filters.status ?? ""} name="status">
          <option value="">All statuses</option>
          <option value="OPEN">Open</option>
          <option value="CLOSED">Closed</option>
        </select>
      </label>

      <div className="flex items-end gap-2 md:col-span-3">
        <button
          className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          type="submit"
        >
          Apply filters
        </button>
        <Link
          className="inline-flex h-9 items-center justify-center rounded-lg border border-border px-4 text-sm font-medium hover:bg-muted"
          href="/maintenance"
        >
          Clear
        </Link>
      </div>
    </form>
  );
}
