import { PageShell } from "@/components/layout/page-shell";
import { Badge } from "@/components/ui/badge";
import { requireAuth } from "@/lib/auth/require-permission";
import { listExpenses, listFuelLogs } from "@/lib/operations/queries";

export default async function FuelPage() {
  await requireAuth();

  const [fuelLogs, expenses] = await Promise.all([listFuelLogs(), listExpenses()]);

  return (
    <PageShell
      title="Fuel & expenses"
      description="Fuel consumption and operational expenses linked to vehicles and trips."
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
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {fuelLogs.map((log) => (
                <tr key={log.id}>
                  <td className="px-4 py-3">{log.vehicle.registrationNumber}</td>
                  <td className="px-4 py-3">{log.trip?.reference ?? "—"}</td>
                  <td className="px-4 py-3">{Number(log.liters).toLocaleString()} L</td>
                  <td className="px-4 py-3">${Number(log.cost).toFixed(2)}</td>
                  <td className="px-4 py-3">{log.loggedAt.toLocaleDateString()}</td>
                </tr>
              ))}
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
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {expenses.map((expense) => (
                <tr key={expense.id}>
                  <td className="px-4 py-3">{expense.vehicle.registrationNumber}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline">{expense.category}</Badge>
                  </td>
                  <td className="px-4 py-3">${Number(expense.amount).toFixed(2)}</td>
                  <td className="px-4 py-3">{expense.note ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </PageShell>
  );
}
