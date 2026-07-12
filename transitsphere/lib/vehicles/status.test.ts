// CRACKODH
import { describe, expect, it } from "vitest";

import {
  getEditableVehicleStatusOptions,
  resolveVehicleStatusCreate,
  resolveVehicleStatusUpdate,
} from "./status";

describe("vehicle status rules", () => {
  it("blocks manual ON_TRIP on create", () => {
    const result = resolveVehicleStatusCreate("ON_TRIP");
    expect(result.ok).toBe(false);
  });

  it("blocks manual IN_SHOP on update from AVAILABLE", () => {
    const result = resolveVehicleStatusUpdate("AVAILABLE", "IN_SHOP");
    expect(result.ok).toBe(false);
  });

  it("preserves ON_TRIP when vehicle is on a trip", () => {
    const result = resolveVehicleStatusUpdate("ON_TRIP", "AVAILABLE");
    expect(result.ok).toBe(false);
  });

  it("allows AVAILABLE to RETIRED", () => {
    const result = resolveVehicleStatusUpdate("AVAILABLE", "RETIRED");
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.status).toBe("RETIRED");
  });

  it("locks status options while on trip", () => {
    const options = getEditableVehicleStatusOptions("ON_TRIP");
    expect(options).toHaveLength(1);
    expect(options[0]?.locked).toBe(true);
  });
});
