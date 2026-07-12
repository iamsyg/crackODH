// CRACKODH
import Link from "next/link";

import { VehicleStatusBadge } from "@/components/vehicles/vehicle-status-badge";
import { buttonVariants } from "@/components/ui/button";
import type { SerializedVehicle } from "@/lib/vehicles/serialize";
import { cn } from "@/lib/utils";

import { DeleteVehicleButton } from "./delete-vehicle-button";

type VehicleTableProps = {
  vehicles: SerializedVehicle[];
  canWrite: boolean;
};

export function VehicleTable({ vehicles, canWrite }: VehicleTableProps) {
  if (vehicles.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
        <p className="text-sm font-medium text-foreground">No vehicles found</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Adjust your filters or add a vehicle to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Registration</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name / Model</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Type</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Capacity</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Odometer</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Region</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
              {canWrite ? (
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
              ) : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id} className="hover:bg-muted/20">
                <td className="px-4 py-3 font-medium">{vehicle.registrationNumber}</td>
                <td className="px-4 py-3">
                  <div>{vehicle.name}</div>
                  {vehicle.model ? (
                    <div className="text-xs text-muted-foreground">{vehicle.model}</div>
                  ) : null}
                </td>
                <td className="px-4 py-3">{vehicle.type}</td>
                <td className="px-4 py-3">{vehicle.maxLoadCapacity.toLocaleString()} kg</td>
                <td className="px-4 py-3">{vehicle.odometer.toLocaleString()} km</td>
                <td className="px-4 py-3">{vehicle.region ?? "—"}</td>
                <td className="px-4 py-3">
                  <VehicleStatusBadge status={vehicle.status} />
                </td>
                {canWrite ? (
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                        href={`/vehicles/${vehicle.id}/edit`}
                      >
                        Edit
                      </Link>
                      <DeleteVehicleButton vehicleId={vehicle.id} vehicleName={vehicle.name} />
                    </div>
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
