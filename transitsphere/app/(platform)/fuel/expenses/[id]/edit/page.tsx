// CRACKODH
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { ExpenseForm } from "@/components/fuel/expense-form";
import { PageShell } from "@/components/layout/page-shell";
import { buttonVariants } from "@/components/ui/button";
import { requireAuth } from "@/lib/auth/require-permission";
import { updateExpense } from "@/lib/expenses/actions";
import {
  getExpenseById,
  getExpenseTripOptions,
  getExpenseVehicleOptions,
} from "@/lib/expenses/queries";
import { hasPermission } from "@/lib/rbac";
import { cn } from "@/lib/utils";

type EditExpensePageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditExpensePage({ params }: EditExpensePageProps) {
  const session = await requireAuth();
  if (!hasPermission(session.user.role, "fuel:write")) {
    redirect("/fuel");
  }

  const { id } = await params;
  const expense = await getExpenseById(id);
  if (!expense) notFound();

  const [vehicles, trips] = await Promise.all([
    getExpenseVehicleOptions(),
    getExpenseTripOptions(expense.vehicleId),
  ]);

  const boundUpdateExpense = updateExpense.bind(null, id);

  return (
    <PageShell
      title="Edit expense"
      description={`Update expense for ${expense.vehicle.registrationNumber}.`}
      actions={
        <Link className={cn(buttonVariants({ variant: "outline" }))} href="/fuel">
          Back to list
        </Link>
      }
    >
      <ExpenseForm
        action={boundUpdateExpense}
        defaultValues={{
          vehicleId: expense.vehicleId,
          tripId: expense.tripId,
          category: expense.category,
          amount: Number(expense.amount),
          note: expense.note,
          incurredAt: expense.incurredAt,
        }}
        submitLabel="Save changes"
        trips={trips}
        vehicles={vehicles}
      />
    </PageShell>
  );
}
