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
      trips: {
        where: { status: "COMPLETED" },
      },
    },
    orderBy: { registrationNumber: "asc" },
  });

  const activeFleet = vehicles.filter((vehicle) => vehicle.status !== "RETIRED").length;
  const onTripCount = vehicles.filter((vehicle) => vehicle.status === "ON_TRIP").length;
  const fleetUtilization = activeFleet > 0 ? Math.round((onTripCount / activeFleet) * 100) : 0;

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
    const totalDistance = vehicle.trips.reduce(
      (sum, trip) => sum + Number(trip.actualDistance ?? trip.plannedDistance),
      0,
    );
    const totalRevenue = vehicle.trips.reduce(
      (sum, trip) => sum + Number(trip.revenue ?? 0),
      0,
    );
    const operationalCost = totalFuelCost + totalMaintenanceCost;
    const acquisitionCost = Number(vehicle.acquisitionCost);
    const fuelEfficiency =
      totalFuelLiters > 0 ? Number((totalDistance / totalFuelLiters).toFixed(2)) : null;
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
