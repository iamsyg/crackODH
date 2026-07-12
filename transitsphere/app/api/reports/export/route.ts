// CRACKODH
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { hasPermission } from "@/lib/rbac";
import { getVehicleReports, vehicleReportsToCsv } from "@/lib/reports/queries";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user || !hasPermission(session.user.role, "reports:view")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await getVehicleReports();
  const csv = vehicleReportsToCsv(rows);
  const filename = `transitops-reports-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
