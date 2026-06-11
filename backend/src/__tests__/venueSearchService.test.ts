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
});
