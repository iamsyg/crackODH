// CRACKODH
import { describe, expect, it } from "vitest";

import {
  validateActiveTripConflict,
  validateCargoCapacity,
  validateDriverAvailableForDispatch,
  validateDriverForTripAssignment,
  validateVehicleAvailableForDispatch,
  validateVehicleForTripAssignment,
} from "./rules";

describe("trip rules", () => {
  it("rejects cargo above vehicle capacity", () => {
    const result = validateCargoCapacity(1500, 1000);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain("1000");
    }
  });

  it("rejects retired or in-shop vehicles", () => {
    expect(validateVehicleForTripAssignment("RETIRED").ok).toBe(false);
    expect(validateVehicleForTripAssignment("IN_SHOP").ok).toBe(false);
    expect(validateVehicleForTripAssignment("AVAILABLE").ok).toBe(true);
  });

  it("rejects suspended and expired-license drivers", () => {
    const expired = new Date();
    expired.setDate(expired.getDate() - 1);

    expect(validateDriverForTripAssignment("SUSPENDED", expired.toISOString()).ok).toBe(false);
    expect(validateDriverForTripAssignment("AVAILABLE", expired.toISOString()).ok).toBe(false);
  });

  it("requires available vehicle and driver for dispatch", () => {
    expect(validateVehicleAvailableForDispatch("ON_TRIP").ok).toBe(false);
    expect(validateDriverAvailableForDispatch("ON_TRIP").ok).toBe(false);
    expect(validateVehicleAvailableForDispatch("AVAILABLE").ok).toBe(true);
    expect(validateDriverAvailableForDispatch("AVAILABLE").ok).toBe(true);
  });

  it("detects active trip conflicts", () => {
    const vehicleConflict = validateActiveTripConflict(true, "vehicle", "draft");
    expect(vehicleConflict.ok).toBe(false);

    const driverConflict = validateActiveTripConflict(true, "driver", "dispatch");
    expect(driverConflict.ok).toBe(false);

    expect(validateActiveTripConflict(false, "vehicle", "draft").ok).toBe(true);
  });
});
