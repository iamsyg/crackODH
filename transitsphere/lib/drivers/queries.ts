// CRACKODH
import type { DriverStatus } from "@/generated/prisma/client";

import { prisma } from "@/lib/prisma";

import type { DriverFilterInput } from "./schema";
import { serializeDriver, type SerializedDriver } from "./serialize";

function complianceWhere(compliance?: DriverFilterInput["compliance"]) {
  if (!compliance) return undefined;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const in30Days = new Date(today);
  in30Days.setDate(in30Days.getDate() + 30);

  if (compliance === "expired") {
    return { licenseExpiryDate: { lt: today } };
  }
  if (compliance === "expiring") {
    return { licenseExpiryDate: { gte: today, lte: in30Days } };
  }
  return { licenseExpiryDate: { gt: in30Days } };
}

export async function listDrivers(filters: DriverFilterInput = {}): Promise<SerializedDriver[]> {
  const drivers = await prisma.driver.findMany({
    where: {
      ...(filters.status ? { status: filters.status as DriverStatus } : {}),
      ...(filters.licenseCategory ? { licenseCategory: filters.licenseCategory } : {}),
      ...(complianceWhere(filters.compliance) ?? {}),
      ...(filters.q
        ? {
            OR: [
              { name: { contains: filters.q, mode: "insensitive" } },
              { licenseNumber: { contains: filters.q, mode: "insensitive" } },
              { contactNumber: { contains: filters.q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: [{ status: "asc" }, { name: "asc" }],
  });

  return drivers.map(serializeDriver);
}

export async function getDriverById(id: string): Promise<SerializedDriver | null> {
  const driver = await prisma.driver.findUnique({ where: { id } });
  return driver ? serializeDriver(driver) : null;
}

export async function getDriverFilterOptions() {
  const categories = await prisma.driver.findMany({
    distinct: ["licenseCategory"],
    select: { licenseCategory: true },
    orderBy: { licenseCategory: "asc" },
  });

  return {
    licenseCategories: categories.map((entry) => entry.licenseCategory),
  };
}
