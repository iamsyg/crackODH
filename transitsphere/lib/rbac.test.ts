// CRACKODH
import { describe, expect, it } from "vitest";

import { hasPermission } from "./rbac";

describe("rbac", () => {
  it("grants Fleet Manager driver write access", () => {
    expect(hasPermission("FLEET_MANAGER", "drivers:write")).toBe(true);
  });

  it("grants Financial Analyst fuel write access", () => {
    expect(hasPermission("FINANCIAL_ANALYST", "fuel:write")).toBe(true);
  });

  it("denies Driver fuel write access", () => {
    expect(hasPermission("DRIVER", "fuel:write")).toBe(false);
  });

  it("denies Safety Officer reports access", () => {
    expect(hasPermission("SAFETY_OFFICER", "reports:view")).toBe(false);
  });
});
