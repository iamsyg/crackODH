// src/components/dashboard/filter-section.tsx

"use client";

import { useState } from "react";

const vehicleTypes = ["All", "Truck", "Van", "Bus", "Sedan", "SUV"];
const statusOptions = ["All", "On Trip", "Completed", "Dispatched", "Draft"];
const regions = ["All", "North", "South", "East", "West", "Central"];

export function FilterSection() {
  const [filters, setFilters] = useState({
    vehicleType: "All",
    status: "All",
    region: "All",
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Filters
        </h2>
        <div className="flex flex-wrap gap-3">
          {/* Vehicle Type Filter */}
          <div className="flex items-center gap-2">
            <label htmlFor="vehicleType" className="text-sm text-muted-foreground">
              Vehicle Type
            </label>
            <select
              id="vehicleType"
              value={filters.vehicleType}
              onChange={(e) => handleFilterChange("vehicleType", e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {vehicleTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <label htmlFor="status" className="text-sm text-muted-foreground">
              Status
            </label>
            <select
              id="status"
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Region Filter */}
          <div className="flex items-center gap-2">
            <label htmlFor="region" className="text-sm text-muted-foreground">
              Region
            </label>
            <select
              id="region"
              value={filters.region}
              onChange={(e) => handleFilterChange("region", e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Button */}
          <button
            onClick={() => setFilters({ vehicleType: "All", status: "All", region: "All" })}
            className="rounded-lg border border-border bg-background px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}