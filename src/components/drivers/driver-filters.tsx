import Link from "next/link";

import {
  DRIVER_STATUS_OPTIONS,
  LICENSE_CATEGORY_OPTIONS,
} from "@/lib/drivers/constants";
import type { DriverFilterInput } from "@/lib/drivers/schema";

type DriverFiltersProps = {
  filters: DriverFilterInput;
  licenseCategories: string[];
};

const selectClassName =
  "h-9 rounded-lg border border-input bg-background px-3 text-sm shadow-sm focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50";

export function DriverFilters({ filters, licenseCategories }: DriverFiltersProps) {
  const categoryOptions = Array.from(
    new Set([...LICENSE_CATEGORY_OPTIONS, ...licenseCategories]),
  ).sort();

  return (
    <form action="/drivers" className="grid gap-3 rounded-xl border border-border bg-card p-4 md:grid-cols-2 lg:grid-cols-5" method="get">
      <label className="grid gap-1.5 text-sm lg:col-span-2">
        <span className="font-medium">Search</span>
        <input
          className={selectClassName}
          defaultValue={filters.q ?? ""}
          name="q"
          placeholder="Name, license, or contact"
          type="search"
        />
      </label>

      <label className="grid gap-1.5 text-sm">
        <span className="font-medium">Status</span>
        <select className={selectClassName} defaultValue={filters.status ?? ""} name="status">
          <option value="">All statuses</option>
          {DRIVER_STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-1.5 text-sm">
        <span className="font-medium">License category</span>
        <select
          className={selectClassName}
          defaultValue={filters.licenseCategory ?? ""}
          name="licenseCategory"
        >
          <option value="">All categories</option>
          {categoryOptions.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-1.5 text-sm">
        <span className="font-medium">License compliance</span>
        <select
          className={selectClassName}
          defaultValue={filters.compliance ?? ""}
          name="compliance"
        >
          <option value="">All</option>
          <option value="valid">Valid</option>
          <option value="expiring">Expiring soon</option>
          <option value="expired">Expired</option>
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
          href="/drivers"
        >
          Clear
        </Link>
      </div>
    </form>
  );
}
