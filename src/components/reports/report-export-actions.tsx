// CRACKODH
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ReportExportActions() {
  return (
    <div className="flex flex-wrap gap-2">
      <Link className={cn(buttonVariants({ variant: "outline" }))} href="/api/reports/export">
        Export CSV
      </Link>
      <Link className={cn(buttonVariants())} href="/api/reports/export/pdf">
        Export PDF
      </Link>
    </div>
  );
}
