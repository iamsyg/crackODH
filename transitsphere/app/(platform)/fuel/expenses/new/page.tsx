// CRACKODH
import Link from "next/link";
import { redirect } from "next/navigation";

import { ExpenseForm } from "@/components/fuel/expense-form";
import { PageShell } from "@/components/layout/page-shell";
import { buttonVariants } from "@/components/ui/button";
import { requireAuth } from "@/lib/auth/require-permission";
import { createExpense } from "@/lib/expenses/actions";
import { getExpenseTripOptions, getExpenseVehicleOptions } from "@/lib/expenses/queries";
import { hasPermission } from "@/lib/rbac";
import { cn } from "@/lib/utils";

export default async function NewExpensePage() {
  const session = await requireAuth();
  if (!hasPermission(session.user.role, "fuel:write")) {
    redirect("/fuel");
  }

  const [vehicles, trips] = await Promise.all([
    getExpenseVehicleOptions(),
    getExpenseTripOptions(),
  ]);

  return (
    <PageShell
      title="Add expense"
      description="Record an operational expense linked to a vehicle."
      actions={
        <Link className={cn(buttonVariants({ variant: "outline" }))} href="/fuel">
          Back to list
        </Link>
      }
    >
      <ExpenseForm
        action={createExpense}
        submitLabel="Create expense"
        trips={trips}
        vehicles={vehicles}
      />
    </PageShell>
  );
}
