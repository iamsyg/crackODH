// CRACKODH
import Link from "next/link";

import { DriverStatusBadge } from "@/components/drivers/driver-status-badge";
import { LicenseComplianceBadge } from "@/components/drivers/license-compliance-badge";
import { buttonVariants } from "@/components/ui/button";
import { formatLicenseExpiry, isLicenseEligible } from "@/lib/drivers/constants";
import type { SerializedDriver } from "@/lib/drivers/serialize";
import { cn } from "@/lib/utils";

import { DeleteDriverButton } from "./delete-driver-button";

type DriverTableProps = {
  drivers: SerializedDriver[];
  canWrite: boolean;
};

export function DriverTable({ drivers, canWrite }: DriverTableProps) {
  if (drivers.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
        <p className="text-sm font-medium text-foreground">No drivers found</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Adjust your filters or add a driver to get started.
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
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">License</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Expiry</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Contact</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Safety</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Eligible</th>
              {canWrite ? (
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
              ) : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {drivers.map((driver) => {
              const eligible = isLicenseEligible(driver.licenseExpiryDate, driver.status);

              return (
                <tr key={driver.id} className="hover:bg-muted/20">
                  <td className="px-4 py-3 font-medium">{driver.name}</td>
                  <td className="px-4 py-3">
                    <div>{driver.licenseNumber}</div>
                    <div className="text-xs text-muted-foreground">Category {driver.licenseCategory}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div>{formatLicenseExpiry(driver.licenseExpiryDate)}</div>
                    <div className="mt-1">
                      <LicenseComplianceBadge licenseExpiryDate={driver.licenseExpiryDate} />
                    </div>
                  </td>
                  <td className="px-4 py-3">{driver.contactNumber}</td>
                  <td className="px-4 py-3">{driver.safetyScore.toFixed(0)}</td>
                  <td className="px-4 py-3">
                    <DriverStatusBadge status={driver.status} />
                  </td>
                  <td className="px-4 py-3">
                    <span className={eligible ? "text-emerald-700" : "text-red-600"}>
                      {eligible ? "Yes" : "No"}
                    </span>
                  </td>
                  {canWrite ? (
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Link
                          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                          href={`/drivers/${driver.id}/edit`}
                        >
                          Edit
                        </Link>
                        <DeleteDriverButton driverId={driver.id} driverName={driver.name} />
                      </div>
                    </td>
                  ) : null}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
