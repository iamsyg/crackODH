// CRACKODH
import Link from "next/link";

import { VEHICLE_STATUS_OPTIONS, VEHICLE_TYPE_OPTIONS } from "@/lib/vehicles/constants";
import type { VehicleFilterInput } from "@/lib/vehicles/schema";

type VehicleFiltersProps = {
  filters: VehicleFilterInput;
  types: string[];
  regions: string[];
};

const selectClassName =
  "h-9 rounded-lg border border-input bg-background px-3 text-sm shadow-sm focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50";

export function VehicleFilters({ filters, types, regions }: VehicleFiltersProps) {
  const typeOptions = Array.from(new Set([...VEHICLE_TYPE_OPTIONS, ...types])).sort();

  return (
    <form action="/vehicles" className="grid gap-3 rounded-xl border border-border bg-card p-4 md:grid-cols-2 lg:grid-cols-5" method="get">
      <label className="grid gap-1.5 text-sm lg:col-span-2">
        <span className="font-medium">Search</span>
        <input
          className={selectClassName}
          defaultValue={filters.q ?? ""}
          name="q"
          placeholder="Registration, name, or model"
          type="search"
        />
      </label>

      <label className="grid gap-1.5 text-sm">
        <span className="font-medium">Type</span>
        <select className={selectClassName} defaultValue={filters.type ?? ""} name="type">
          <option value="">All types</option>
          {typeOptions.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-1.5 text-sm">
        <span className="font-medium">Status</span>
        <select className={selectClassName} defaultValue={filters.status ?? ""} name="status">
          <option value="">All statuses</option>
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

      <div className="flex items-end gap-2 md:col-span-2 lg:col-span-5">
        <button
          className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          type="submit"
        >
          Apply filters
        </button>
        <Link
          className="inline-flex h-9 items-center justify-center rounded-lg border border-border px-4 text-sm font-medium hover:bg-muted"
          href="/vehicles"
        >
          Clear
        </Link>
      </div>
    </form>
  );
}
