import type { PrismaClient } from "@prisma/client";
import { MockTicketProvider } from "../providers/mockProviders.js";

const ticketProvider = new MockTicketProvider();

export async function handleAssistantMessage(
  prisma: PrismaClient,
  userId: string,
  message: string,
  context?: {
    topVenueId?: string;
    sport?: string;
    league?: string;
    teamId?: string;
    gameId?: string;
    venueTypes?: string[];
    city?: string;
  }
) {
  const normalized = message.toLowerCase();

  if (normalized.includes("save") && normalized.includes("top") && context?.topVenueId) {
    await prisma.userSavedVenue.upsert({
      where: { userId_venueId: { userId, venueId: context.topVenueId } },
      create: { userId, venueId: context.topVenueId, notes: "Saved from assistant." },
      update: {}
    });
    return {
      reply: "Saved the top venue for you.",
      actions: [{ type: "saved-venue", venueId: context.topVenueId }]
    };
  }

  if (normalized.includes("restaurant")) {
    return {
      reply: "I switched the idea toward restaurants. Use the suggested filter to rerun the venue search.",
      suggestedFilters: { venueTypes: ["Restaurant"] }
    };
  }

  if (normalized.includes("bar")) {
    return {
      reply: "Sports bars are usually a strong match because they combine screens, fan crowd, and venue-type fit.",
      suggestedFilters: { venueTypes: ["Sports bar"] }
    };
  }

  if (normalized.includes("soccer")) {
    const games = await prisma.game.findMany({
      where: { sport: "Soccer", startTime: { gte: new Date() } },
      include: { homeTeam: true, awayTeam: true },
      orderBy: { startTime: "asc" },
      take: 4
    });
    return {
      reply: `I found ${games.length} upcoming soccer games.`,
      games
    };
  }

  if (normalized.includes("cowboys") || normalized.includes("lakers")) {
    const teamName = normalized.includes("cowboys") ? "Dallas Cowboys" : "Los Angeles Lakers";
    const team = await prisma.team.findFirst({ where: { name: teamName } });
    const games = team
      ? await prisma.game.findMany({
          where: {
            startTime: { gte: new Date() },
            OR: [{ homeTeamId: team.id }, { awayTeamId: team.id }]
          },
          include: { homeTeam: true, awayTeam: true },
          orderBy: { startTime: "asc" },
          take: 3
        })
      : [];
    return {
      reply: `I found ${games.length} upcoming ${teamName} game${games.length === 1 ? "" : "s"}. Try searching with that team selected.`,
      suggestedFilters: team ? { teamId: team.id, sport: team.sport, league: team.league } : undefined,
      games
    };
  }

  if (normalized.includes("ticket")) {
    const gameIds = context?.gameId ? [context.gameId] : [];
    const tickets = await ticketProvider.getOffers(gameIds);
    return {
      reply: tickets.length > 0 ? "Here are ticket options for the selected game." : "Select a game first and I can show ticket options.",
      tickets
    };
  }

  return {
    reply:
      "I can help with searches like finding a sports bar, switching to restaurants, showing soccer games, saving the top venue, or showing ticket options."
  };
}
