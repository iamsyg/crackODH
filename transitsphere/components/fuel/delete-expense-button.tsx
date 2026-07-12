// CRACKODH
"use client";

import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { deleteExpense } from "@/lib/expenses/actions";

type DeleteExpenseButtonProps = {
  expenseId: string;
  label: string;
};

export function DeleteExpenseButton({ expenseId, label }: DeleteExpenseButtonProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      disabled={isPending}
      onClick={() => {
        const confirmed = window.confirm(`Delete expense for ${label}?`);
        if (!confirmed) return;

        startTransition(async () => {
          await deleteExpense(expenseId);
        });
      }}
      size="sm"
      type="button"
      variant="destructive"
    >
      {isPending ? "Removing..." : "Delete"}
    </Button>
  );
}
