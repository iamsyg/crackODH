// CRACKODH
export type VehicleReportRow = {
  registrationNumber: string;
  name: string;
  type: string;
  acquisitionCost: number;
  totalDistance: number;
  totalFuelLiters: number;
  totalFuelCost: number;
  totalMaintenanceCost: number;
  totalExpenseCost: number;
  operationalCost: number;
  totalRevenue: number;
  fuelEfficiency: number | null;
  fleetUtilization: number;
  roi: number | null;
};

export async function getVehicleReports(): Promise<VehicleReportRow[]> {
  const { prisma } = await import("@/lib/prisma");

  const vehicles = await prisma.vehicle.findMany({
    include: {
      fuelLogs: true,
      maintenanceLogs: true,
      expenses: true,
      trips: {
        where: { status: "COMPLETED" },
      },
    },
    orderBy: { registrationNumber: "asc" },
  });

  const activeVehicles = vehicles.filter((vehicle) => vehicle.status !== "RETIRED");
  const fleetTotalDistance = activeVehicles.reduce((sum, vehicle) => {
    const distance = vehicle.trips.reduce(
      (tripSum, trip) => tripSum + Number(trip.actualDistance ?? trip.plannedDistance),
      0,
    );
    return sum + distance;
  }, 0);

  return vehicles.map((vehicle) => {
    const totalFuelLiters = vehicle.fuelLogs.reduce(
      (sum, log) => sum + Number(log.liters),
      0,
    );
    const totalFuelCost = vehicle.fuelLogs.reduce((sum, log) => sum + Number(log.cost), 0);
    const totalMaintenanceCost = vehicle.maintenanceLogs.reduce(
      (sum, log) => sum + Number(log.cost),
      0,
    );
    const totalExpenseCost = vehicle.expenses.reduce(
      (sum, expense) => sum + Number(expense.amount),
      0,
    );
    const totalDistance = vehicle.trips.reduce(
      (sum, trip) => sum + Number(trip.actualDistance ?? trip.plannedDistance),
      0,
    );
    const totalRevenue = vehicle.trips.reduce(
      (sum, trip) => sum + Number(trip.revenue ?? 0),
      0,
    );
    const operationalCost = totalFuelCost + totalMaintenanceCost + totalExpenseCost;
    const acquisitionCost = Number(vehicle.acquisitionCost);
    const fuelEfficiency =
      totalFuelLiters > 0 ? Number((totalDistance / totalFuelLiters).toFixed(2)) : null;
    const fleetUtilization =
      vehicle.status !== "RETIRED" && fleetTotalDistance > 0
        ? Math.round((totalDistance / fleetTotalDistance) * 100)
        : 0;
    const roi =
      acquisitionCost > 0
        ? Number(((totalRevenue - operationalCost) / acquisitionCost).toFixed(4))
        : null;

    return {
      registrationNumber: vehicle.registrationNumber,
      name: vehicle.name,
      type: vehicle.type,
      acquisitionCost,
      totalDistance,
      totalFuelLiters,
      totalFuelCost,
      totalMaintenanceCost,
      totalExpenseCost,
      operationalCost,
      totalRevenue,
      fuelEfficiency,
      fleetUtilization,
      roi,
    };
  });
}

export function vehicleReportsToCsv(rows: VehicleReportRow[]) {
  const headers = [
    "Registration",
    "Name",
    "Type",
    "Acquisition Cost",
    "Total Distance (km)",
    "Fuel (L)",
    "Fuel Cost",
    "Maintenance Cost",
    "Other Expenses",
    "Operational Cost",
    "Revenue",
    "Fuel Efficiency (km/L)",
    "Fleet Utilization (%)",
    "ROI",
  ];

  const lines = rows.map((row) =>
    [
      row.registrationNumber,
      row.name,
      row.type,
      row.acquisitionCost,
      row.totalDistance,
      row.totalFuelLiters,
      row.totalFuelCost,
      row.totalMaintenanceCost,
      row.totalExpenseCost,
      row.operationalCost,
      row.totalRevenue,
      row.fuelEfficiency ?? "",
      row.fleetUtilization,
      row.roi ?? "",
    ]
      .map((value) => `"${String(value).replace(/"/g, '""')}"`)
      .join(","),
  );

  return [headers.join(","), ...lines].join("\n");
}
