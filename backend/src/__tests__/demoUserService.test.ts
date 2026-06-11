import { describe, expect, it } from "vitest";
import { buildDefaultDemoUserProfile } from "../services/demoUserService.js";

describe("demo user defaults", () => {
  it("creates an immediately usable demo profile without credential fields", () => {
    const defaults = buildDefaultDemoUserProfile();

    expect(defaults.displayName).toBe("Traveling Fan");
    expect(defaults.profile.preferredSports).toContain("Basketball");
    expect(defaults.profile.preferredVenueTypes).toContain("Sports bar");
    expect(Object.keys(defaults)).not.toContain("password");
    expect(Object.keys(defaults)).not.toContain("jwt");
  });
});
