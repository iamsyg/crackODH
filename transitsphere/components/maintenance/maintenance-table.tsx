// CRACKODH
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import type { SerializedMaintenanceLog } from "@/lib/maintenance/serialize";
import { cn } from "@/lib/utils";

type MaintenanceTableProps = {
  logs: SerializedMaintenanceLog[];
  canWrite: boolean;
};

export function MaintenanceTable({ logs, canWrite }: MaintenanceTableProps) {
  if (logs.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
        <p className="text-sm font-medium text-foreground">No maintenance records found</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Log maintenance to move a vehicle into shop status.
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
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Vehicle</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Description</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Cost</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Opened</th>
              {canWrite ? (
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
              ) : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-muted/20">
                <td className="px-4 py-3">
                  <div className="font-medium">{log.vehicleRegistration}</div>
                  <div className="text-xs text-muted-foreground">{log.vehicleName}</div>
                </td>
                <td className="px-4 py-3">{log.description}</td>
                <td className="px-4 py-3">
                  <Badge variant={log.status === "OPEN" ? "warning" : "success"}>
                    {log.status === "OPEN" ? "Open" : "Closed"}
                  </Badge>
                </td>
                <td className="px-4 py-3">${log.cost.toFixed(2)}</td>
                <td className="px-4 py-3">{new Date(log.openedAt).toLocaleDateString()}</td>
                {canWrite ? (
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      {log.status === "OPEN" ? (
                        <>
                          <Link
                            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                            href={`/maintenance/${log.id}/edit`}
                          >
                            Edit
                          </Link>
                          <Link
                            className={cn(buttonVariants({ size: "sm" }))}
                            href={`/maintenance/${log.id}/close`}
                          >
                            Close
                          </Link>
                        </>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
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
