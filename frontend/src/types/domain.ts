export interface UserProfile {
  id: string;
  userId: string;
  preferredSports: string[];
  preferredLeagues: string[];
  preferredVenueTypes: string[];
  travelModeEnabled: boolean;
}

export interface Team {
  id: string;
  name: string;
  sport: string;
  league: string;
  city: string;
  country: string;
  logoUrl?: string | null;
}

export interface FavoriteTeam {
  id: string;
  userId: string;
  teamId: string;
  team: Team;
}

export interface User {
  id: string;
  displayName: string;
  homeCity?: string | null;
  isPremium: boolean;
  profile?: UserProfile | null;
  favoriteTeams?: FavoriteTeam[];
}

export interface Game {
  id: string;
  sport: string;
  league: string;
  homeTeamId: string;
  awayTeamId: string;
  startTime: string;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  broadcastInfo?: string | null;
  homeTeam: Team;
  awayTeam: Team;
}

export interface RankedVenue {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  websiteUrl?: string | null;
  venueType: string;
  description?: string | null;
  rating?: number | null;
  isSponsored: boolean;
  confidenceScore: number;
  confidencePercentage: number;
  evidenceText: string;
  evidenceBadges: string[];
  matchedSignals: Array<{
    key: string;
    label: string;
    detail: string;
    weight: number;
  }>;
  distanceKm?: number;
  relevantGame?: {
    id: string;
    label: string;
    startTime: string;
  };
  monetizationCta?: {
    label: string;
    kind: "sponsored" | "promotion";
  };
}

export interface SavedVenue {
  id: string;
  userId: string;
  venueId: string;
  notes?: string | null;
  createdAt: string;
  venue: RankedVenue;
}

export interface AgentCard {
  type:
    | "best-venue"
    | "best-game"
    | "team-friendly"
    | "ticket"
    | "sponsored"
    | "promotion"
    | "try-search";
  title: string;
  description: string;
  ctaLabel?: string;
  metadata?: Record<string, unknown>;
}

export interface TicketOffer {
  id: string;
  gameId: string;
  title: string;
  description: string;
  ctaLabel: string;
  targetUrl?: string;
}

export interface BettingWidgetData {
  enabled: boolean;
  title: string;
  description: string;
  disclaimer: string;
}

export interface AdPlacement {
  id: string;
  placementKey: string;
  title: string;
  description: string;
  advertiserName: string;
  targetUrl?: string | null;
}

export interface PartnerOffer {
  id: string;
  partnerType: string;
  title: string;
  description: string;
  ctaLabel: string;
  targetUrl?: string | null;
}

export interface VenueSearchPayload {
  sport?: string;
  league?: string;
  teamId?: string;
  gameId?: string;
  latitude?: number;
  longitude?: number;
  city?: string;
  venueTypes: string[];
  radiusKm: number;
  query?: string;
}

export interface VenueSearchResponse {
  games: Game[];
  venues: RankedVenue[];
  agentRecommendations: AgentCard[];
  monetization: {
    tickets: TicketOffer[];
    betting: BettingWidgetData;
    ads: AdPlacement[];
    promotions: PartnerOffer[];
    premiumAdsHidden: boolean;
  };
  mapAvailable: boolean;
}
