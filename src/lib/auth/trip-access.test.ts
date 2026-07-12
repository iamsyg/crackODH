// CRACKODH
import { describe, expect, it } from "vitest";

import { canManageTrips } from "./trip-access";

describe("trip access", () => {
  it("allows fleet managers to plan trips", () => {
    expect(canManageTrips("FLEET_MANAGER")).toBe(true);
    expect(canManageTrips("SAFETY_OFFICER")).toBe(true);
  });

  it("blocks drivers from trip planning", () => {
    expect(canManageTrips("DRIVER")).toBe(false);
  });
});
