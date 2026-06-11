import { describe, expect, it } from "vitest";
import { buildAgentCards } from "../services/agentService.js";
import type { RankedVenue } from "../types/api.js";

const venue: RankedVenue = {
  id: "venue-1",
  name: "Top Sports Bar",
  address: "1 Main St",
  city: "Los Angeles",
  state: "CA",
  country: "USA",
  latitude: 34.05,
  longitude: -118.24,
  venueType: "Sports bar",
  source: "test",
  isSponsored: true,
  confidenceScore: 0.92,
  evidenceText: "Lakers watch party evidence."
};

describe("agent recommendations", () => {
  it("returns sidebar cards and hides sponsored cards for premium users", () => {
    const cards = buildAgentCards({
      venues: [venue],
      games: [
        {
          id: "game-1",
          sport: "Basketball",
          league: "NBA",
          startTime: new Date(),
          homeTeam: { name: "Los Angeles Lakers" },
          awayTeam: { name: "Boston Celtics" }
        }
      ],
      tickets: [
        {
          id: "ticket-1",
          gameId: "game-1",
          title: "Tickets",
          description: "Mock ticket option.",
          ctaLabel: "Find tickets"
        }
      ],
      ads: [{ title: "Ad", description: "Sponsored placement.", advertiserName: "Sponsor" }],
      promotions: [{ title: "Wings", description: "Food deal.", ctaLabel: "View deal" }],
      isPremium: true,
      search: { venueTypes: ["Sports bar"], radiusKm: 25 }
    });

    expect(cards.some((card) => card.type === "best-venue")).toBe(true);
    expect(cards.some((card) => card.type === "ticket")).toBe(true);
    expect(cards.some((card) => card.type === "sponsored")).toBe(false);
  });
});
