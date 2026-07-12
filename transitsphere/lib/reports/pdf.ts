// CRACKODH
import PDFDocument from "pdfkit";

import type { VehicleReportRow } from "./queries";

export async function vehicleReportsToPdf(rows: VehicleReportRow[]) {
  return new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40, size: "A4", layout: "landscape" });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const generatedAt = new Date().toLocaleString();

    doc.fontSize(18).text("TransitOps — Vehicle Reports", { align: "center" });
    doc.fontSize(10).fillColor("#666666").text(`Generated ${generatedAt}`, { align: "center" });
    doc.moveDown(1.5);
    doc.fillColor("#000000");

    const totals = rows.reduce(
      (acc, row) => ({
        operationalCost: acc.operationalCost + row.operationalCost,
        revenue: acc.revenue + row.totalRevenue,
        distance: acc.distance + row.totalDistance,
      }),
      { operationalCost: 0, revenue: 0, distance: 0 },
    );

    doc
      .fontSize(11)
      .text(
        `Vehicles: ${rows.length}  |  Total distance: ${totals.distance.toLocaleString()} km  |  Operational cost: $${totals.operationalCost.toFixed(2)}  |  Revenue: $${totals.revenue.toFixed(2)}`,
      );
    doc.moveDown(1);

    const columns = [
      { label: "Vehicle", width: 70, align: "left" as const },
      { label: "Distance", width: 55, align: "right" as const },
      { label: "Fuel $", width: 50, align: "right" as const },
      { label: "Maint $", width: 50, align: "right" as const },
      { label: "Exp $", width: 45, align: "right" as const },
      { label: "Op cost", width: 55, align: "right" as const },
      { label: "Revenue", width: 55, align: "right" as const },
      { label: "Eff km/L", width: 50, align: "right" as const },
      { label: "Util %", width: 40, align: "right" as const },
      { label: "ROI %", width: 45, align: "right" as const },
    ];

    const tableLeft = 40;
    const tableWidth = columns.reduce((sum, column) => sum + column.width, 0);
    let y = doc.y;

    doc.fontSize(9).font("Helvetica-Bold");
    let x = tableLeft;
    for (const column of columns) {
      doc.text(column.label, x, y, { width: column.width, align: column.align });
      x += column.width;
    }

    y += 16;
    doc.moveTo(tableLeft, y).lineTo(tableLeft + tableWidth, y).stroke("#cccccc");
    y += 6;

    doc.font("Helvetica").fontSize(8);

    for (const row of rows) {
      if (y > doc.page.height - 60) {
        doc.addPage({ layout: "landscape", margin: 40 });
        y = 40;
      }

      const values = [
        row.registrationNumber,
        `${row.totalDistance.toLocaleString()} km`,
        `$${row.totalFuelCost.toFixed(0)}`,
        `$${row.totalMaintenanceCost.toFixed(0)}`,
        `$${row.totalExpenseCost.toFixed(0)}`,
        `$${row.operationalCost.toFixed(0)}`,
        `$${row.totalRevenue.toFixed(0)}`,
        row.fuelEfficiency ? row.fuelEfficiency.toFixed(1) : "—",
        `${row.fleetUtilization}%`,
        row.roi !== null ? `${(row.roi * 100).toFixed(1)}%` : "—",
      ];

      x = tableLeft;
      values.forEach((value, index) => {
        doc.text(String(value), x, y, {
          width: columns[index].width,
          align: columns[index].align,
        });
        x += columns[index].width;
      });

      y += 14;
    }

    doc.end();
  });
}

export function pdfReportFilename() {
  return `transitops-reports-${new Date().toISOString().slice(0, 10)}.pdf`;
}
