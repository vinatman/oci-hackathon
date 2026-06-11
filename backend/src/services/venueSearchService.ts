import type { Prisma, PrismaClient } from "@prisma/client";
import { MockGameProvider, MockVenueProvider } from "../providers/mockProviders.js";
import type { RankedVenue } from "../types/api.js";
import { buildAgentCards } from "./agentService.js";
import { getMonetizationForUser } from "./monetizationService.js";
import { haversineKm, scoreVenue } from "./scoring.js";
import type { VenueSearchInput } from "./validation.js";

type VenueWithAffinity = Prisma.VenueGetPayload<{
  include: { teamAffinity: { include: { team: true } }; _count: { select: { savedBy: true } } };
}>;

type PreferenceSource = {
  homeCity?: string | null;
  profile?: {
    preferredSports: string[];
    preferredLeagues: string[];
    preferredVenueTypes: string[];
  } | null;
  favoriteTeams?: Array<{
    team: {
      id: string;
      sport: string;
      league: string;
    };
  }>;
};

const cityCenters: Record<string, { latitude: number; longitude: number }> = {
  "new york": { latitude: 40.7128, longitude: -74.006 },
  "san francisco": { latitude: 37.7749, longitude: -122.4194 },
  "los angeles": { latitude: 34.0522, longitude: -118.2437 },
  chicago: { latitude: 41.8781, longitude: -87.6298 },
  dallas: { latitude: 32.7767, longitude: -96.797 },
  boston: { latitude: 42.3601, longitude: -71.0589 },
  seattle: { latitude: 47.6062, longitude: -122.3321 },
  "las vegas": { latitude: 36.1716, longitude: -115.1391 }
};

const gameProvider = new MockGameProvider();
const venueProvider = new MockVenueProvider();

function normalizedCity(city?: string) {
  return city?.trim().toLowerCase();
}

function selectedLocation(input: VenueSearchInput) {
  if (typeof input.latitude === "number" && typeof input.longitude === "number") {
    return { latitude: input.latitude, longitude: input.longitude };
  }
  const city = normalizedCity(input.city);
  return city ? cityCenters[city] : undefined;
}

function relevantAffinity(venue: VenueWithAffinity, teamId?: string) {
  if (teamId) {
    return venue.teamAffinity.find((affinity) => affinity.teamId === teamId);
  }
  return [...venue.teamAffinity].sort((a, b) => b.confidenceScore - a.confidenceScore)[0];
}

export function applyProfilePreferenceDefaults(user: PreferenceSource, input: VenueSearchInput): VenueSearchInput {
  const hasBrowserCoordinates = typeof input.latitude === "number" && typeof input.longitude === "number";
  const preferredSport = input.sport ?? user.profile?.preferredSports[0];
  const preferredLeague = input.league ?? user.profile?.preferredLeagues[0];
  const matchingFavoriteTeam = user.favoriteTeams?.find(({ team }) => {
    if (preferredSport && team.sport !== preferredSport) return false;
    if (preferredLeague && team.league !== preferredLeague) return false;
    return true;
  })?.team;
  const favoriteTeam = matchingFavoriteTeam ?? (!preferredSport && !preferredLeague ? user.favoriteTeams?.[0]?.team : undefined);

  return {
    ...input,
    sport: preferredSport ?? favoriteTeam?.sport,
    league: preferredLeague ?? favoriteTeam?.league,
    teamId: input.teamId ?? favoriteTeam?.id,
    city: hasBrowserCoordinates ? undefined : input.city ?? user.homeCity ?? undefined,
    venueTypes:
      input.venueTypes.length > 0
        ? input.venueTypes
        : user.profile?.preferredVenueTypes.length
          ? user.profile.preferredVenueTypes.slice(0, 2)
          : []
  };
}

export async function findVenueMatches(prisma: PrismaClient, userId: string, input: VenueSearchInput) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true, favoriteTeams: { include: { team: true }, orderBy: { createdAt: "asc" } } }
  });

  if (!user) {
    throw Object.assign(new Error("User not found"), { statusCode: 404 });
  }

  const effectiveInput = applyProfilePreferenceDefaults(user, input);
  const games = await gameProvider.upcoming(prisma, effectiveInput);
  const selectedTeam = effectiveInput.teamId
    ? user.favoriteTeams.find((favorite) => favorite.team.id === effectiveInput.teamId)?.team ??
      games
        .flatMap((game) => [game.homeTeam, game.awayTeam])
        .find((team) => team.id === effectiveInput.teamId) ??
      (await prisma.team.findUnique({ where: { id: effectiveInput.teamId } }))
    : undefined;
  let venues = (await venueProvider.search(prisma, effectiveInput)) as VenueWithAffinity[];

  if (venues.length === 0 && effectiveInput.venueTypes.length > 0) {
    venues = (await venueProvider.search(prisma, { ...effectiveInput, venueTypes: [] })) as VenueWithAffinity[];
  }

  const origin = selectedLocation(effectiveInput);
  const rankedVenues = venues
    .map((venue) => {
      const distanceKm = origin
        ? haversineKm(origin, { latitude: venue.latitude, longitude: venue.longitude })
        : undefined;
      const affinity = relevantAffinity(venue, effectiveInput.teamId);
      const score = scoreVenue({
        venue: {
          ...venue,
          savedCount: venue._count.savedBy
        },
        search: effectiveInput,
        affinity: affinity
          ? {
              confidenceScore: affinity.confidenceScore,
              evidenceText: affinity.evidenceText
            }
          : undefined,
        distanceKm,
        teamName: selectedTeam?.name
      });
      const relevantGame = games[0]
        ? {
            id: games[0].id,
            label: `${games[0].awayTeam.name} at ${games[0].homeTeam.name}`,
            startTime: games[0].startTime.toISOString()
          }
        : undefined;

      return {
        ...venue,
        confidenceScore: score.confidenceScore,
        confidencePercentage: score.confidencePercentage,
        evidenceText: score.evidenceText,
        evidenceBadges: score.evidenceBadges,
        matchedSignals: score.matchedSignals,
        distanceKm,
        relevantGame,
        monetizationCta:
          venue.isSponsored && !user.isPremium ? { label: "Sponsored table option", kind: "sponsored" as const } : undefined
      };
    })
    .filter((venue) => (origin ? (venue.distanceKm ?? 0) <= effectiveInput.radiusKm : true))
    .sort((a, b) => b.confidenceScore - a.confidenceScore)
    .slice(0, 10) as RankedVenue[];

  await prisma.searchHistory.create({
    data: {
      userId,
      latitude: effectiveInput.latitude,
      longitude: effectiveInput.longitude,
      city: effectiveInput.city,
      sport: effectiveInput.sport,
      league: effectiveInput.league,
      teamId: effectiveInput.teamId,
      gameId: effectiveInput.gameId,
      venueTypes: effectiveInput.venueTypes,
      query: effectiveInput.query
    }
  });

  const monetization = await getMonetizationForUser(prisma, userId, {
    gameIds: effectiveInput.gameId ? [effectiveInput.gameId] : games.slice(0, 3).map((game) => game.id)
  });

  return {
    user,
    games,
    venues: rankedVenues,
    monetization,
    search: effectiveInput
  };
}

export async function searchVenues(prisma: PrismaClient, userId: string, input: VenueSearchInput) {
  const matches = await findVenueMatches(prisma, userId, input);
  const agentCards = buildAgentCards({
    venues: matches.venues,
    games: matches.games,
    tickets: matches.monetization.tickets,
    ads: matches.monetization.ads,
    promotions: matches.monetization.promotions,
    isPremium: matches.user.isPremium,
    search: matches.search
  });

  return {
    games: matches.games,
    venues: matches.venues,
    agentRecommendations: agentCards,
    monetization: matches.monetization,
    mapAvailable: matches.venues.some((venue) => venue.latitude && venue.longitude)
  };
}
