import "dotenv/config";

import { hash } from "bcryptjs";

import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

const demoPassword = "password123";

const demoUsers = [
  { name: "Fleet Manager", email: "fleet@transitops.com", role: "FLEET_MANAGER" as const },
  { name: "Alex Driver", email: "driver@transitops.com", role: "DRIVER" as const },
  { name: "Safety Officer", email: "safety@transitops.com", role: "SAFETY_OFFICER" as const },
  { name: "Financial Analyst", email: "finance@transitops.com", role: "FINANCIAL_ANALYST" as const },
];

const vehicles = [
  {
    registrationNumber: "VAN-05",
    name: "Van-05",
    model: "Ford Transit 350",
    type: "Van",
    maxLoadCapacity: 500,
    odometer: 12840,
    acquisitionCost: 28000,
    status: "AVAILABLE" as const,
    region: "North",
  },
  {
    registrationNumber: "TRK-12",
    name: "Heavy Hauler",
    model: "Volvo FH16",
    type: "Truck",
    maxLoadCapacity: 5000,
    odometer: 84200,
    acquisitionCost: 95000,
    status: "ON_TRIP" as const,
    region: "West",
  },
  {
    registrationNumber: "BUS-03",
    name: "City Shuttle",
    model: "Mercedes Sprinter",
    type: "Bus",
    maxLoadCapacity: 1200,
    odometer: 45600,
    acquisitionCost: 62000,
    status: "IN_SHOP" as const,
    region: "East",
  },
  {
    registrationNumber: "PCK-08",
    name: "Pickup Alpha",
    model: "Toyota Hilux",
    type: "Pickup",
    maxLoadCapacity: 900,
    odometer: 32100,
    acquisitionCost: 34000,
    status: "AVAILABLE" as const,
    region: "South",
  },
  {
    registrationNumber: "VAN-11",
    name: "Legacy Van",
    model: "Renault Master",
    type: "Van",
    maxLoadCapacity: 750,
    odometer: 156000,
    acquisitionCost: 18000,
    status: "RETIRED" as const,
    region: "North",
  },
];

async function main() {
  const passwordHash = await hash(demoPassword, 12);

  for (const user of demoUsers) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: { name: user.name, role: user.role, passwordHash },
      create: { name: user.name, email: user.email, role: user.role, passwordHash },
    });
  }

  const driverUser = await prisma.user.findUniqueOrThrow({
    where: { email: "driver@transitops.com" },
  });

  for (const vehicle of vehicles) {
    await prisma.vehicle.upsert({
      where: { registrationNumber: vehicle.registrationNumber },
      update: vehicle,
      create: vehicle,
    });
  }

  const [van05, trk12, bus03, pck08] = await Promise.all([
    prisma.vehicle.findUniqueOrThrow({ where: { registrationNumber: "VAN-05" } }),
    prisma.vehicle.findUniqueOrThrow({ where: { registrationNumber: "TRK-12" } }),
    prisma.vehicle.findUniqueOrThrow({ where: { registrationNumber: "BUS-03" } }),
    prisma.vehicle.findUniqueOrThrow({ where: { registrationNumber: "PCK-08" } }),
  ]);

  const drivers = [
    {
      licenseNumber: "DL-ALEX-2024",
      name: "Alex",
      licenseCategory: "B",
      licenseExpiryDate: new Date("2027-06-15"),
      contactNumber: "+1 555 0101",
      safetyScore: 96,
      status: "AVAILABLE" as const,
      userId: driverUser.id,
    },
    {
      licenseNumber: "DL-MARIA-2022",
      name: "Maria Santos",
      licenseCategory: "C",
      licenseExpiryDate: new Date("2026-11-20"),
      contactNumber: "+1 555 0102",
      safetyScore: 91,
      status: "ON_TRIP" as const,
      userId: null,
    },
    {
      licenseNumber: "DL-JAMES-2023",
      name: "James Chen",
      licenseCategory: "B",
      licenseExpiryDate: new Date("2028-03-10"),
      contactNumber: "+1 555 0103",
      safetyScore: 88,
      status: "AVAILABLE" as const,
      userId: null,
    },
    {
      licenseNumber: "DL-PRIYA-2021",
      name: "Priya Patel",
      licenseCategory: "B",
      licenseExpiryDate: new Date("2026-08-01"),
      contactNumber: "+1 555 0104",
      safetyScore: 94,
      status: "OFF_DUTY" as const,
      userId: null,
    },
    {
      licenseNumber: "DL-TOM-2019",
      name: "Tom Wright",
      licenseCategory: "C",
      licenseExpiryDate: new Date("2025-12-01"),
      contactNumber: "+1 555 0105",
      safetyScore: 72,
      status: "SUSPENDED" as const,
      userId: null,
    },
    {
      licenseNumber: "DL-ELENA-2020",
      name: "Elena Rossi",
      licenseCategory: "B",
      licenseExpiryDate: new Date("2025-05-01"),
      contactNumber: "+1 555 0106",
      safetyScore: 85,
      status: "AVAILABLE" as const,
      userId: null,
    },
  ];

  for (const driver of drivers) {
    await prisma.driver.upsert({
      where: { licenseNumber: driver.licenseNumber },
      update: driver,
      create: driver,
    });
  }

  const [alex, maria, james] = await Promise.all([
    prisma.driver.findUniqueOrThrow({ where: { licenseNumber: "DL-ALEX-2024" } }),
    prisma.driver.findUniqueOrThrow({ where: { licenseNumber: "DL-MARIA-2022" } }),
    prisma.driver.findUniqueOrThrow({ where: { licenseNumber: "DL-JAMES-2023" } }),
  ]);

  const completedAt = new Date("2026-07-01T14:30:00Z");
  const dispatchedAt = new Date("2026-07-10T08:00:00Z");
  const cancelledAt = new Date("2026-07-05T11:00:00Z");

  const trips = [
    {
      reference: "TRIP-1001",
      source: "Warehouse A, North District",
      destination: "Retail Hub 7, North District",
      vehicleId: van05.id,
      driverId: alex.id,
      cargoWeight: 450,
      plannedDistance: 62,
      actualDistance: 64,
      finalOdometer: 12840,
      revenue: 820,
      status: "COMPLETED" as const,
      dispatchedAt: new Date("2026-07-01T07:30:00Z"),
      completedAt,
      cancelledAt: null,
    },
    {
      reference: "TRIP-1002",
      source: "Port Terminal, West Bay",
      destination: "Distribution Center 3, West Bay",
      vehicleId: trk12.id,
      driverId: maria.id,
      cargoWeight: 4200,
      plannedDistance: 118,
      actualDistance: null,
      finalOdometer: null,
      revenue: 2400,
      status: "DISPATCHED" as const,
      dispatchedAt,
      completedAt: null,
      cancelledAt: null,
    },
    {
      reference: "TRIP-1003",
      source: "Depot South",
      destination: "Client Site 12, South Ridge",
      vehicleId: pck08.id,
      driverId: james.id,
      cargoWeight: 650,
      plannedDistance: 45,
      actualDistance: null,
      finalOdometer: null,
      revenue: 540,
      status: "DRAFT" as const,
      dispatchedAt: null,
      completedAt: null,
      cancelledAt: null,
    },
    {
      reference: "TRIP-1004",
      source: "Factory East",
      destination: "Airport Cargo, East Zone",
      vehicleId: pck08.id,
      driverId: alex.id,
      cargoWeight: 700,
      plannedDistance: 88,
      actualDistance: null,
      finalOdometer: null,
      revenue: 0,
      status: "CANCELLED" as const,
      dispatchedAt: null,
      completedAt: null,
      cancelledAt,
    },
  ];

  for (const trip of trips) {
    await prisma.trip.upsert({
      where: { reference: trip.reference },
      update: trip,
      create: trip,
    });
  }

  const completedTrip = await prisma.trip.findUniqueOrThrow({ where: { reference: "TRIP-1001" } });
  const dispatchedTrip = await prisma.trip.findUniqueOrThrow({ where: { reference: "TRIP-1002" } });

  await prisma.maintenanceLog.deleteMany({
    where: { vehicleId: { in: [bus03.id, van05.id, trk12.id] } },
  });

  await prisma.maintenanceLog.createMany({
    data: [
      {
        vehicleId: bus03.id,
        description: "Oil change and brake inspection",
        status: "OPEN",
        openedAt: new Date("2026-07-08T09:00:00Z"),
        cost: 0,
      },
      {
        vehicleId: van05.id,
        description: "Tire rotation",
        status: "CLOSED",
        openedAt: new Date("2026-06-10T10:00:00Z"),
        closedAt: new Date("2026-06-10T16:00:00Z"),
        cost: 180,
      },
    ],
  });

  await prisma.fuelLog.deleteMany({
    where: { vehicleId: { in: [van05.id, trk12.id, pck08.id, bus03.id] } },
  });

  await prisma.fuelLog.createMany({
    data: [
      {
        vehicleId: van05.id,
        tripId: completedTrip.id,
        liters: 18.5,
        cost: 28.5,
        odometer: 12840,
        loggedAt: completedAt,
      },
      {
        vehicleId: trk12.id,
        tripId: dispatchedTrip.id,
        liters: 95,
        cost: 142,
        odometer: 84120,
        loggedAt: dispatchedAt,
      },
      {
        vehicleId: pck08.id,
        liters: 42,
        cost: 63,
        odometer: 32050,
        loggedAt: new Date("2026-07-09T17:00:00Z"),
      },
      {
        vehicleId: bus03.id,
        liters: 55,
        cost: 82.5,
        odometer: 45580,
        loggedAt: new Date("2026-07-07T12:00:00Z"),
      },
    ],
  });

  await prisma.expense.deleteMany({
    where: { vehicleId: { in: [van05.id, trk12.id, pck08.id] } },
  });

  await prisma.expense.createMany({
    data: [
      {
        vehicleId: van05.id,
        tripId: completedTrip.id,
        category: "TOLL",
        amount: 12,
        note: "North express toll",
        incurredAt: completedAt,
      },
      {
        vehicleId: van05.id,
        tripId: completedTrip.id,
        category: "PARKING",
        amount: 8,
        note: "Retail hub parking",
        incurredAt: completedAt,
      },
      {
        vehicleId: trk12.id,
        tripId: dispatchedTrip.id,
        category: "TOLL",
        amount: 35,
        note: "West bay bridge toll",
        incurredAt: dispatchedAt,
      },
      {
        vehicleId: pck08.id,
        category: "OTHER",
        amount: 25,
        note: "Cleaning supplies",
        incurredAt: new Date("2026-07-08T08:00:00Z"),
      },
    ],
  });

  console.log("Seed complete. Sign in with password123\n");
  console.log("Users:");
  for (const user of demoUsers) {
    console.log(`  ${user.role.padEnd(18)} ${user.email}`);
  }
  console.log(`\nVehicles: ${vehicles.length}`);
  console.log(`Drivers:  ${drivers.length}`);
  console.log(`Trips:    ${trips.length} (completed, dispatched, draft, cancelled)`);
  console.log("Maintenance logs: 2 | Fuel logs: 4 | Expenses: 4");
  console.log("\nDemo workflow: dispatch TRIP-1003, complete TRIP-1002, try over-capacity on VAN-05.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
