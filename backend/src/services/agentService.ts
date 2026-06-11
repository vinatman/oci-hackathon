import type { AgentCard, RankedVenue, TicketOffer } from "../types/api.js";
import type { VenueSearchInput } from "./validation.js";

interface MinimalGame {
  id: string;
  sport: string;
  league: string;
  startTime: Date | string;
  homeTeam?: { name: string } | null;
  awayTeam?: { name: string } | null;
}

interface MinimalAd {
  title: string;
  description: string;
  advertiserName?: string;
}

interface MinimalPromotion {
  title: string;
  description: string;
  ctaLabel: string;
}

export function formatGameLabel(game: MinimalGame) {
  const home = game.homeTeam?.name ?? "Home team";
  const away = game.awayTeam?.name ?? "Away team";
  return `${away} at ${home}`;
}

export function buildAgentCards(input: {
  venues: RankedVenue[];
  games: MinimalGame[];
  tickets: TicketOffer[];
  ads: MinimalAd[];
  promotions: MinimalPromotion[];
  isPremium: boolean;
  search: VenueSearchInput;
}): AgentCard[] {
  const cards: AgentCard[] = [];
  const bestVenue = input.venues[0];
  const bestGame = input.games[0];

  if (bestVenue) {
    cards.push({
      type: "best-venue",
      title: "Best venue near you",
      description: `${bestVenue.name} scores ${Math.round(bestVenue.confidenceScore * 100)}% because ${bestVenue.evidenceText}.`,
      ctaLabel: "View venue",
      metadata: { venueId: bestVenue.id }
    });
  }

  if (bestGame) {
    cards.push({
      type: "best-game",
      title: "Best upcoming game",
      description: `${formatGameLabel(bestGame)} is the closest match for this search.`,
      ctaLabel: "Use game",
      metadata: { gameId: bestGame.id }
    });
  }

  const teamFriendlyVenue = input.venues.find((venue) => venue.evidenceText.toLowerCase().includes("watch"));
  if (teamFriendlyVenue) {
    cards.push({
      type: "team-friendly",
      title: "Team-friendly venue",
      description: `${teamFriendlyVenue.name} has strong fan or watch-party evidence.`,
      ctaLabel: "Save venue",
      metadata: { venueId: teamFriendlyVenue.id }
    });
  }

  const ticket = input.tickets[0];
  if (ticket) {
    cards.push({
      type: "ticket",
      title: "Ticket option",
      description: ticket.description,
      ctaLabel: ticket.ctaLabel,
      metadata: { ticketId: ticket.id, gameId: ticket.gameId }
    });
  }

  if (!input.isPremium) {
    const sponsoredVenue = input.venues.find((venue) => venue.isSponsored);
    const ad = input.ads[0];
    if (sponsoredVenue || ad) {
      cards.push({
        type: "sponsored",
        title: "Sponsored venue",
        description: sponsoredVenue
          ? `${sponsoredVenue.name} has a sponsored placement but was still scored on relevance signals.`
          : `${ad?.title}: ${ad?.description}`,
        ctaLabel: "Sponsored",
        metadata: { venueId: sponsoredVenue?.id, advertiserName: ad?.advertiserName }
      });
    }
  }

  const promotion = input.promotions[0];
  if (promotion) {
    cards.push({
      type: "promotion",
      title: "Local promotion",
      description: promotion.description,
      ctaLabel: promotion.ctaLabel
    });
  }

  const nextVenueType = input.search.venueTypes.includes("Sports bar") ? "Restaurant" : "Sports bar";
  cards.push({
    type: "try-search",
    title: "Try this search",
    description: `Switch venue type to ${nextVenueType} or expand the radius for more options.`,
    ctaLabel: "Try search",
    metadata: { venueTypes: [nextVenueType] }
  });

  return cards;
}
