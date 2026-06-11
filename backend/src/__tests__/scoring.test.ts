import { describe, expect, it } from "vitest";
import { scoreVenue } from "../services/scoring.js";

describe("venue confidence scoring", () => {
  it("rewards venue type, city, distance, affinity, and watch-party evidence", () => {
    const score = scoreVenue({
      venue: {
        city: "Los Angeles",
        venueType: "Sports bar",
        description: "Big screen Lakers watch party and sports bar atmosphere.",
        isSponsored: true
      },
      search: {
        city: "Los Angeles",
        sport: "Basketball",
        league: "NBA",
        teamId: "lakers",
        venueTypes: ["Sports bar"],
        radiusKm: 25
      },
      affinity: {
        confidenceScore: 0.9,
        evidenceText: "Lakers fan club watch party evidence."
      },
      distanceKm: 2
    });

    expect(score.confidenceScore).toBeGreaterThan(0.8);
    expect(score.evidenceText).toContain("sponsored venue, capped");
  });
});
