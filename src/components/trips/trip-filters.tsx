import Link from "next/link";

import { TRIP_STATUS_OPTIONS } from "@/lib/trips/constants";
import type { TripFilterInput } from "@/lib/trips/schema";

type TripFiltersProps = {
  filters: TripFilterInput;
};

const selectClassName =
  "h-9 rounded-lg border border-input bg-background px-3 text-sm shadow-sm focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50";

export function TripFilters({ filters }: TripFiltersProps) {
  return (
    <form action="/trips" className="grid gap-3 rounded-xl border border-border bg-card p-4 md:grid-cols-2 lg:grid-cols-4" method="get">
      <label className="grid gap-1.5 text-sm lg:col-span-2">
        <span className="font-medium">Search</span>
        <input
          className={selectClassName}
          defaultValue={filters.q ?? ""}
          name="q"
          placeholder="Reference, route, vehicle, or driver"
          type="search"
        />
      </label>

      <label className="grid gap-1.5 text-sm">
        <span className="font-medium">Status</span>
        <select className={selectClassName} defaultValue={filters.status ?? ""} name="status">
          <option value="">All statuses</option>
          {TRIP_STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
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
          href="/trips"
        >
          Clear
        </Link>
      </div>
    </form>
  );
}
