// CRACKODH
import type { Driver } from "@/generated/prisma/client";

import type { DriverStatusValue } from "./constants";

export type SerializedDriver = {
  id: string;
  name: string;
  licenseNumber: string;
  licenseCategory: string;
  licenseExpiryDate: string;
  contactNumber: string;
  safetyScore: number;
  status: DriverStatusValue;
  userId: string | null;
  createdAt: string;
  updatedAt: string;
};

export function serializeDriver(driver: Driver): SerializedDriver {
  return {
    id: driver.id,
    name: driver.name,
    licenseNumber: driver.licenseNumber,
    licenseCategory: driver.licenseCategory,
    licenseExpiryDate: driver.licenseExpiryDate.toISOString(),
    contactNumber: driver.contactNumber,
    safetyScore: Number(driver.safetyScore),
    status: driver.status,
    userId: driver.userId,
    createdAt: driver.createdAt.toISOString(),
    updatedAt: driver.updatedAt.toISOString(),
  };
}
