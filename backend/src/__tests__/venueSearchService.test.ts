import { describe, expect, it } from "vitest";
import { applyProfilePreferenceDefaults } from "../services/venueSearchService.js";

describe("venue search preference defaults", () => {
  it("uses profile preferences and only selects a matching favorite team", () => {
    const input = applyProfilePreferenceDefaults(
      {
        homeCity: "Seattle",
        profile: {
          preferredSports: ["Soccer"],
          preferredLeagues: ["MLS"],
          preferredVenueTypes: ["Pub", "Watch party"]
        },
        favoriteTeams: [
          { team: { id: "lakers", sport: "Basketball", league: "NBA" } },
          { team: { id: "sounders", sport: "Soccer", league: "MLS" } }
        ]
      },
      { venueTypes: [], radiusKm: 40 }
    );

    expect(input).toMatchObject({
      sport: "Soccer",
      league: "MLS",
      teamId: "sounders",
      city: "Seattle",
      venueTypes: ["Pub", "Watch party"]
    });
  });

  it("does not apply the home city when browser coordinates are present", () => {
    const input = applyProfilePreferenceDefaults(
      {
        homeCity: "Los Angeles",
        profile: {
          preferredSports: [],
          preferredLeagues: [],
          preferredVenueTypes: ["Sports bar"]
        },
        favoriteTeams: []
      },
      { latitude: 37.7749, longitude: -122.4194, venueTypes: [], radiusKm: 40 }
    );

    expect(input.city).toBeUndefined();
    expect(input.latitude).toBe(37.7749);
    expect(input.longitude).toBe(-122.4194);
  });
});
