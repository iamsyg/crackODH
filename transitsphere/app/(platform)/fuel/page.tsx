// CRACKODH
import Link from "next/link";

import { DeleteExpenseButton } from "@/components/fuel/delete-expense-button";
import { DeleteFuelLogButton } from "@/components/fuel/delete-fuel-log-button";
import { PageShell } from "@/components/layout/page-shell";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { requireAuth } from "@/lib/auth/require-permission";
import { listExpenses, listFuelLogs } from "@/lib/operations/queries";
import { hasPermission } from "@/lib/rbac";
import { cn } from "@/lib/utils";

export default async function FuelPage() {
  const session = await requireAuth();
  const canWrite = hasPermission(session.user.role, "fuel:write");

  const [fuelLogs, expenses] = await Promise.all([listFuelLogs(), listExpenses()]);

  return (
    <PageShell
      title="Fuel & expenses"
      description="Fuel consumption and operational expenses linked to vehicles and trips."
      actions={
        canWrite ? (
          <div className="flex gap-2">
            <Link className={cn(buttonVariants({ variant: "outline" }))} href="/fuel/logs/new">
              Log fuel
            </Link>
            <Link className={cn(buttonVariants())} href="/fuel/expenses/new">
              Add expense
            </Link>
          </div>
        ) : undefined
      }
    >
      <section className="grid gap-4">
        <h2 className="text-lg font-semibold">Fuel logs</h2>
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <table className="min-w-full divide-y divide-border text-sm">
            <thead className="bg-muted/40">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Vehicle</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Trip</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Liters</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Cost</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
                {canWrite ? (
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
                ) : null}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {fuelLogs.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-muted-foreground" colSpan={canWrite ? 6 : 5}>
                    No fuel logs recorded yet.
                  </td>
                </tr>
              ) : (
                fuelLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="px-4 py-3">{log.vehicle.registrationNumber}</td>
                    <td className="px-4 py-3">{log.trip?.reference ?? "—"}</td>
                    <td className="px-4 py-3">{Number(log.liters).toLocaleString()} L</td>
                    <td className="px-4 py-3">${Number(log.cost).toFixed(2)}</td>
                    <td className="px-4 py-3">{log.loggedAt.toLocaleDateString()}</td>
                    {canWrite ? (
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <Link
                            className={cn(buttonVariants({ size: "sm", variant: "outline" }))}
                            href={`/fuel/logs/${log.id}/edit`}
                          >
                            Edit
                          </Link>
                          <DeleteFuelLogButton
                            fuelLogId={log.id}
                            label={log.vehicle.registrationNumber}
                          />
                        </div>
                      </td>
                    ) : null}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4">
        <h2 className="text-lg font-semibold">Expenses</h2>
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <table className="min-w-full divide-y divide-border text-sm">
            <thead className="bg-muted/40">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Vehicle</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Category</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Amount</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Note</th>
                {canWrite ? (
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
                ) : null}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {expenses.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-muted-foreground" colSpan={canWrite ? 5 : 4}>
                    No expenses recorded yet.
                  </td>
                </tr>
              ) : (
                expenses.map((expense) => (
                  <tr key={expense.id}>
                    <td className="px-4 py-3">{expense.vehicle.registrationNumber}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline">{expense.category}</Badge>
                    </td>
                    <td className="px-4 py-3">${Number(expense.amount).toFixed(2)}</td>
                    <td className="px-4 py-3">{expense.note ?? "—"}</td>
                    {canWrite ? (
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <Link
                            className={cn(buttonVariants({ size: "sm", variant: "outline" }))}
                            href={`/fuel/expenses/${expense.id}/edit`}
                          >
                            Edit
                          </Link>
                          <DeleteExpenseButton
                            expenseId={expense.id}
                            label={expense.vehicle.registrationNumber}
                          />
                        </div>
                      </td>
                    ) : null}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </PageShell>
  );
}
