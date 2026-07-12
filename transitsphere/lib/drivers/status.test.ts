// CRACKODH
import { describe, expect, it } from "vitest";

import {
  getEditableDriverStatusOptions,
  resolveDriverStatusCreate,
  resolveDriverStatusUpdate,
} from "./status";

describe("driver status rules", () => {
  it("blocks manual ON_TRIP on create", () => {
    const result = resolveDriverStatusCreate("ON_TRIP");
    expect(result.ok).toBe(false);
  });

  it("blocks manual ON_TRIP on update", () => {
    const result = resolveDriverStatusUpdate("AVAILABLE", "ON_TRIP");
    expect(result.ok).toBe(false);
  });

  it("preserves ON_TRIP while driver is on a trip", () => {
    const result = resolveDriverStatusUpdate("ON_TRIP", "OFF_DUTY");
    expect(result.ok).toBe(false);
  });

  it("allows AVAILABLE to SUSPENDED", () => {
    const result = resolveDriverStatusUpdate("AVAILABLE", "SUSPENDED");
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.status).toBe("SUSPENDED");
  });

  it("locks status options while on trip", () => {
    const options = getEditableDriverStatusOptions("ON_TRIP");
    expect(options).toHaveLength(1);
    expect(options[0]?.locked).toBe(true);
  });
});
