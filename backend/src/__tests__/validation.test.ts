import { describe, expect, it } from "vitest";
import { profileUpdateSchema } from "../services/validation.js";

describe("profile validation", () => {
  it("accepts premium profile updates with MVP preference arrays", () => {
    const result = profileUpdateSchema.parse({
      displayName: "Traveling Fan",
      homeCity: "Seattle",
      isPremium: true,
      preferredSports: ["Soccer"],
      preferredLeagues: ["MLS"],
      preferredVenueTypes: ["Sports bar", "Restaurant"],
      travelModeEnabled: true
    });

    expect(result.isPremium).toBe(true);
    expect(result.preferredVenueTypes).toContain("Restaurant");
  });
});
