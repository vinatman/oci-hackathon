import type { PrismaClient } from "@prisma/client";
import type {
  AdProvider,
  BettingProvider,
  GameDiscoveryProvider,
  PartnerOfferProvider,
  TicketProvider,
  VenueDiscoveryProvider
} from "./interfaces.js";
import type { VenueSearchInput } from "../services/validation.js";

export class MockVenueProvider implements VenueDiscoveryProvider {
  name = "mock-venue-provider";

  async search(prisma: PrismaClient, input: VenueSearchInput) {
    const cityFilter = input.city ? { equals: input.city, mode: "insensitive" as const } : undefined;
    return prisma.venue.findMany({
      where: {
        ...(cityFilter ? { city: cityFilter } : {}),
        ...(input.venueTypes.length > 0 ? { venueType: { in: input.venueTypes } } : {})
      },
      include: {
        teamAffinity: {
          include: { team: true }
        }
      }
    });
  }
}

export class WebSearchVenueProvider implements VenueDiscoveryProvider {
  name = "web-search-venue-provider-placeholder";

  async search() {
    return [];
  }
}

export class PartnerVenueProvider implements VenueDiscoveryProvider {
  name = "partner-venue-provider-placeholder";

  async search() {
    return [];
  }
}

export class MockGameProvider implements GameDiscoveryProvider {
  name = "mock-game-provider";

  async upcoming(prisma: PrismaClient, input: VenueSearchInput) {
    return prisma.game.findMany({
      where: {
        startTime: { gte: new Date() },
        ...(input.gameId ? { id: input.gameId } : {}),
        ...(input.sport ? { sport: input.sport } : {}),
        ...(input.league ? { league: input.league } : {}),
        ...(input.teamId
          ? {
              OR: [{ homeTeamId: input.teamId }, { awayTeamId: input.teamId }]
            }
          : {})
      },
      include: {
        homeTeam: true,
        awayTeam: true
      },
      orderBy: { startTime: "asc" },
      take: 8
    });
  }
}

export class ExternalSportsApiProvider implements GameDiscoveryProvider {
  name = "external-sports-api-provider-placeholder";

  async upcoming() {
    return [];
  }
}

export class MockTicketProvider implements TicketProvider {
  name = "mock-ticket-provider";

  async getOffers(gameIds: string[]) {
    const templates = [
      {
        title: "Fan ticket marketplace",
        description: "Browse available seats for the selected game.",
        ctaLabel: "Find tickets",
        targetUrl: "https://example.com/tickets/marketplace"
      },
      {
        title: "Upper bowl value seats",
        description: "A value-seat option for fans who want to attend instead of watch nearby.",
        ctaLabel: "Find tickets",
        targetUrl: "https://example.com/tickets/value"
      },
      {
        title: "Lower bowl upgrade",
        description: "Premium-seat option attached to the selected upcoming game.",
        ctaLabel: "Find tickets",
        targetUrl: "https://example.com/tickets/lower-bowl"
      },
      {
        title: "Family section option",
        description: "A family-friendly ticket block for traveling supporters.",
        ctaLabel: "Find tickets",
        targetUrl: "https://example.com/tickets/family"
      },
      {
        title: "Last-minute fan pass",
        description: "Last-minute ticket option for game-day decisions.",
        ctaLabel: "Find tickets",
        targetUrl: "https://example.com/tickets/last-minute"
      }
    ];

    return gameIds.flatMap((gameId) =>
      templates.map((template, index) => ({
        ...template,
        id: `mock-ticket-${index + 1}`,
        gameId
      }))
    ).slice(0, 5);
  }
}

export class TicketmasterProvider implements TicketProvider {
  name = "ticketmaster-provider-placeholder";

  async getOffers() {
    return [];
  }
}

export class MockBettingProvider implements BettingProvider {
  name = "mock-betting-provider";

  async getWidget(enabled: boolean) {
    return {
      enabled,
      title: enabled ? "Responsible gaming information" : "Responsible gaming unavailable",
      description: enabled
        ? "Responsible gaming partner information. No odds, advice, or wagering is available."
        : "Responsible gaming modules are unavailable in this demo.",
      disclaimer:
        "Responsible gaming: this MVP does not provide betting advice, odds, deposits, or real-money wagering."
    };
  }
}

export class MockAdProvider implements AdProvider {
  name = "mock-ad-provider";

  async getAds(prisma: PrismaClient) {
    return prisma.adPlacement.findMany({
      where: { active: true },
      orderBy: { createdAt: "asc" },
      take: 5
    });
  }
}

export class MockPartnerOfferProvider implements PartnerOfferProvider {
  name = "mock-partner-offer-provider";

  async getOffers(prisma: PrismaClient) {
    return prisma.partnerOffer.findMany({
      where: { active: true },
      orderBy: { createdAt: "asc" },
      take: 5
    });
  }
}
