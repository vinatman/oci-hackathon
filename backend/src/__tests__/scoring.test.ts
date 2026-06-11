import { describe, expect, it } from "vitest";
import { scoreVenue } from "../services/scoring.js";
import type { VenueSearchInput } from "../services/validation.js";

const baseSearch: VenueSearchInput = {
  city: "Los Angeles",
  sport: "Basketball",
  league: "NBA",
  teamId: "team-lakers",
  venueTypes: [],
  radiusKm: 25
};

const unrelatedVenue = {
  name: "Quiet Coffee Room",
  city: "Los Angeles",
  venueType: "Cafe",
  description: "Quiet place for reading and remote work.",
  isSponsored: false
};

function score(overrides: Partial<Parameters<typeof scoreVenue>[0]> = {}) {
  return scoreVenue({
    venue: unrelatedVenue,
    search: baseSearch,
    ...overrides
  });
}

describe("venue confidence scoring", () => {
  it("team name match increases score", () => {
    const withoutTeam = score({
      affinity: { confidenceScore: 0.5, evidenceText: "Basketball watch party evidence." },
      teamName: "Boston Celtics"
    });
    const withTeam = score({
      affinity: { confidenceScore: 0.5, evidenceText: "Lakers watch party evidence." },
      teamName: "Los Angeles Lakers"
    });

    expect(withTeam.confidenceScore).toBeGreaterThan(withoutTeam.confidenceScore);
    expect(withTeam.evidenceBadges).toContain("Team mentioned");
  });

  it("league match increases score", () => {
    const withoutLeague = score({ affinity: { confidenceScore: 0.5, evidenceText: "Basketball watch party evidence." } });
    const withLeague = score({ affinity: { confidenceScore: 0.5, evidenceText: "NBA watch party evidence." } });

    expect(withLeague.confidenceScore).toBeGreaterThan(withoutLeague.confidenceScore);
    expect(withLeague.evidenceBadges).toContain("League mentioned");
  });

  it("sports bar venue type increases score", () => {
    const cafe = score();
    const sportsBar = score({ venue: { ...unrelatedVenue, venueType: "Sports bar" } });

    expect(sportsBar.confidenceScore).toBeGreaterThan(cafe.confidenceScore);
    expect(sportsBar.evidenceBadges).toContain("Sports bar");
  });

  it("watch party language increases score", () => {
    const withoutWatchParty = score();
    const withWatchParty = score({
      venue: { ...unrelatedVenue, description: "Alumni and fans gather for rivalry watch party nights." }
    });

    expect(withWatchParty.confidenceScore).toBeGreaterThan(withoutWatchParty.confidenceScore);
    expect(withWatchParty.evidenceBadges).toContain("Watch party");
  });

  it("proximity affects score", () => {
    const far = score({ distanceKm: 24 });
    const close = score({ distanceKm: 2 });

    expect(close.confidenceScore).toBeGreaterThan(far.confidenceScore);
    expect(close.evidenceBadges).toContain("Close by");
  });

  it("unrelated venue receives lower score", () => {
    const unrelated = score();
    const strongMatch = score({
      venue: {
        name: "Lakers Fan Club Sports Bar",
        city: "Los Angeles",
        venueType: "Sports bar",
        description: "Big screen sports bar with game-day fans and rivalry watch parties.",
        isSponsored: false,
        savedCount: 4
      },
      affinity: {
        confidenceScore: 0.95,
        evidenceText: "Lakers and NBA supporters host watch party nights here."
      },
      teamName: "Los Angeles Lakers",
      distanceKm: 1
    });

    expect(strongMatch.confidenceScore).toBeGreaterThan(unrelated.confidenceScore);
    expect(strongMatch.confidencePercentage).toBe(Math.round(strongMatch.confidenceScore * 100));
    expect(strongMatch.matchedSignals.length).toBeGreaterThan(4);
  });

  it("scores never go below 0 or above 1", () => {
    const low = score({
      venue: { ...unrelatedVenue, city: "Boston" },
      search: { ...baseSearch, city: "Dallas", radiusKm: 1 },
      distanceKm: 100
    });
    const high = score({
      venue: {
        name: "Lakers NBA Alumni Watch Party Sports Bar",
        city: "Los Angeles",
        venueType: "Sports bar",
        description: "Big screen sports bar for Lakers NBA fans, supporters, alumni, game day, and rivalry watch party.",
        isSponsored: true,
        savedCount: 12
      },
      search: { ...baseSearch, venueTypes: ["Sports bar"] },
      affinity: {
        confidenceScore: 1,
        evidenceText: "Lakers NBA fans and alumni watch party evidence."
      },
      teamName: "Los Angeles Lakers",
      distanceKm: 0.2
    });

    expect(low.confidenceScore).toBeGreaterThanOrEqual(0);
    expect(low.confidenceScore).toBeLessThanOrEqual(1);
    expect(high.confidenceScore).toBeGreaterThanOrEqual(0);
    expect(high.confidenceScore).toBeLessThanOrEqual(1);
  });
});
