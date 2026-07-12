// CRACKODH
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { hasPermission } from "@/lib/rbac";
import { pdfReportFilename, vehicleReportsToPdf } from "@/lib/reports/pdf";
import { getVehicleReports } from "@/lib/reports/queries";

export const runtime = "nodejs";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user || !hasPermission(session.user.role, "reports:view")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await getVehicleReports();
  const pdf = await vehicleReportsToPdf(rows);

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${pdfReportFilename()}"`,
    },
  });
}
