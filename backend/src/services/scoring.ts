import type { VenueSearchInput } from "./validation.js";

export interface ScoreableVenue {
  city: string;
  venueType: string;
  description?: string | null;
  isSponsored: boolean;
}

export interface ScoreableAffinity {
  confidenceScore: number;
  evidenceText: string;
}

export interface VenueScoreInput {
  venue: ScoreableVenue;
  search: VenueSearchInput;
  affinity?: ScoreableAffinity;
  distanceKm?: number;
}

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

export function scoreVenue({ venue, search, affinity, distanceKm }: VenueScoreInput) {
  const evidence: string[] = [];
  let score = 0.24;

  if (search.venueTypes.length > 0 && search.venueTypes.includes(venue.venueType)) {
    score += 0.2;
    evidence.push(`matches preferred venue type: ${venue.venueType}`);
  }

  if (search.city && venue.city.toLowerCase() === search.city.toLowerCase()) {
    score += 0.14;
    evidence.push(`located in ${venue.city}`);
  }

  if (typeof distanceKm === "number") {
    const distanceBoost = Math.max(0, 0.18 * (1 - Math.min(distanceKm, search.radiusKm) / search.radiusKm));
    score += distanceBoost;
    evidence.push(`${distanceKm.toFixed(1)} km from selected location`);
  }

  if (affinity) {
    score += 0.22 * affinity.confidenceScore;
    evidence.push(affinity.evidenceText);
  }

  const searchableText = `${venue.description ?? ""} ${affinity?.evidenceText ?? ""}`.toLowerCase();
  for (const term of [search.sport, search.league].filter(Boolean) as string[]) {
    if (searchableText.includes(term.toLowerCase())) {
      score += 0.05;
      evidence.push(`mentions ${term}`);
    }
  }

  if (/watch party|sports bar|big screen|fan club|game-day/i.test(searchableText)) {
    score += 0.08;
    evidence.push("has watch-party or sports-bar indicators");
  }

  if (venue.isSponsored) {
    score += 0.03;
    evidence.push("sponsored venue, capped to avoid dominating relevance");
  }

  return {
    confidenceScore: Math.max(0, Math.min(1, Number(score.toFixed(2)))),
    evidenceText: evidence.length > 0 ? evidence.join("; ") : "general venue match"
  };
}
