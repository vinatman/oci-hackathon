import type { VenueSearchInput } from "./validation.js";

export interface ScoreableVenue {
  name: string;
  city: string;
  venueType: string;
  description?: string | null;
  isSponsored: boolean;
  savedCount?: number;
}

export interface ScoreableAffinity {
  confidenceScore: number;
  evidenceText: string;
}

export interface MatchedSignal {
  key: string;
  label: string;
  detail: string;
  weight: number;
}

export interface VenueScoreInput {
  venue: ScoreableVenue;
  search: VenueSearchInput;
  affinity?: ScoreableAffinity;
  distanceKm?: number;
  teamName?: string;
}

const strongVenueTypes = new Set(["sports bar", "pub", "bar", "restaurant", "stadium bar", "fan club", "watch party"]);
const sportsTerms = [
  "sports",
  "screen",
  "screens",
  "big screen",
  "broadcast",
  "game",
  "match",
  "kickoff",
  "puck",
  "hoops",
  "football",
  "basketball",
  "baseball",
  "hockey",
  "soccer"
];
const watchPartyTerms = ["watch party", "game day", "game-day", "fans", "supporters", "alumni", "rivalry"];
const teamTokenStopWords = new Set(["the", "fc", "cf", "sc", "los", "san", "new", "city", "united"]);

export function haversineKm(
  from: { latitude: number; longitude: number },
  to: { latitude: number; longitude: number }
) {
  const earthRadiusKm = 6371;
  const dLat = degreesToRadians(to.latitude - from.latitude);
  const dLon = degreesToRadians(to.longitude - from.longitude);
  const lat1 = degreesToRadians(from.latitude);
  const lat2 = degreesToRadians(to.latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

function degreesToRadians(value: number) {
  return (value * Math.PI) / 180;
}

export function scoreVenue({ venue, search, affinity, distanceKm, teamName }: VenueScoreInput) {
  const matchedSignals: MatchedSignal[] = [];
  const evidenceBadges: string[] = [];
  let score = 0.2;

  const searchableText = `${venue.name} ${venue.description ?? ""} ${affinity?.evidenceText ?? ""}`.toLowerCase();
  const evidenceOnlyText = (affinity?.evidenceText ?? "").toLowerCase();
  const venueType = venue.venueType.toLowerCase();

  const addSignal = (signal: MatchedSignal, badge?: string) => {
    score += signal.weight;
    matchedSignals.push(signal);
    if (badge && !evidenceBadges.includes(badge)) {
      evidenceBadges.push(badge);
    }
  };

  if (strongVenueTypes.has(venueType)) {
    const label = venueType === "sports bar" ? "Sports bar" : `${venue.venueType} venue`;
    addSignal(
      {
        key: "venue-type",
        label,
        detail: `${venue.name} is categorized as a ${venue.venueType}, which is a high-intent setting for watching live sports.`,
        weight: venueType === "sports bar" || venueType === "watch party" ? 0.14 : 0.1
      },
      venueType === "sports bar" ? "Sports bar" : venue.venueType
    );
  }

  if (search.venueTypes.length > 0 && search.venueTypes.includes(venue.venueType)) {
    addSignal({
      key: "preferred-venue-type",
      label: "Matches your venue style",
      detail: `It matches the selected venue style: ${venue.venueType}.`,
      weight: 0.08
    });
  }

  if (search.city && venue.city.toLowerCase() === search.city.toLowerCase()) {
    addSignal({
      key: "city-match",
      label: "Same city",
      detail: `It is located in ${venue.city}, matching the selected city.`,
      weight: 0.08
    });
  }

  if (typeof distanceKm === "number") {
    const radius = Math.max(search.radiusKm || 1, 1);
    const distanceBoost = Math.max(0, 0.13 * (1 - Math.min(distanceKm, radius) / radius));
    if (distanceBoost > 0) {
      addSignal(
        {
          key: "proximity",
          label: "Close by",
          detail: `${venue.name} is ${distanceKm.toFixed(1)} km from the selected location.`,
          weight: distanceBoost
        },
        distanceKm <= Math.min(5, radius * 0.35) ? "Close by" : undefined
      );
    }
  }

  if (affinity) {
    addSignal(
      {
        key: "team-affinity",
        label: "Known fan venue",
        detail: affinity.evidenceText,
        weight: 0.16 * affinity.confidenceScore
      },
      "Known fan venue"
    );
  }

  if (sportsTerms.some((term) => searchableText.includes(term))) {
    addSignal(
      {
        key: "sports-language",
        label: "Sports language",
        detail: "The venue name, description, or evidence includes sports-viewing language.",
        weight: 0.07
      },
      "Sports signal"
    );
  }

  if (search.league && termMatches(evidenceOnlyText, search.league)) {
    addSignal(
      {
        key: "league-mentioned",
        label: "League mentioned",
        detail: `The venue evidence mentions ${search.league}.`,
        weight: 0.08
      },
      "League mentioned"
    );
  }

  if (watchPartyTerms.some((term) => searchableText.includes(term))) {
    addSignal(
      {
        key: "watch-party-language",
        label: "Watch-party language",
        detail: "The venue evidence includes watch-party, game-day, fans, supporters, alumni, or rivalry language.",
        weight: 0.1
      },
      "Watch party"
    );
  }

  if (venue.savedCount && venue.savedCount > 0) {
    addSignal(
      {
        key: "saved-by-fans",
        label: "Saved by fans",
        detail: `${venue.savedCount} fan${venue.savedCount === 1 ? " has" : "s have"} saved this venue.`,
        weight: 0.06
      },
      "Saved by fans"
    );
  }

  if (teamName && teamNameMatches(evidenceOnlyText, teamName, search.teamId)) {
    addSignal(
      {
        key: "team-mentioned",
        label: "Team mentioned",
        detail: `The venue evidence mentions ${teamName}.`,
        weight: 0.12
      },
      "Team mentioned"
    );
  }

  if (venue.isSponsored) {
    addSignal({
      key: "sponsored-capped",
      label: "Sponsored placement",
      detail: "Sponsorship adds only a small capped boost and does not dominate the ranking.",
      weight: 0.01
    });
  }

  const confidenceScore = Math.max(0, Math.min(1, Number(score.toFixed(2))));
  const confidencePercentage = Math.round(confidenceScore * 100);
  const customerSignals = matchedSignals.filter((signal) => signal.key !== "sponsored-capped");

  return {
    confidenceScore,
    confidencePercentage,
    evidenceText:
      customerSignals.length > 0
        ? `Matched on ${customerSignals
            .slice(0, 4)
            .map((signal) => signal.label.toLowerCase())
            .join(", ")}.`
        : "General venue match with limited team-specific evidence.",
    evidenceBadges,
    matchedSignals
  };
}

function termMatches(text: string, term: string) {
  return text.includes(term.toLowerCase());
}

function teamNameMatches(text: string, teamNameOrId: string, teamId?: string) {
  if (!teamNameOrId) return false;
  const normalized = teamNameOrId.toLowerCase();
  if (text.includes(normalized)) return true;
  if (teamId && text.includes(teamId.toLowerCase())) return true;

  return normalized
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length >= 4 && !teamTokenStopWords.has(token))
    .some((token) => text.includes(token));
}
