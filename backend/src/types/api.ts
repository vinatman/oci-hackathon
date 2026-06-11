export type AgentCardType =
  | "best-venue"
  | "best-game"
  | "team-friendly"
  | "ticket"
  | "sponsored"
  | "promotion"
  | "try-search";

export interface AgentCard {
  type: AgentCardType;
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

export interface BettingWidget {
  enabled: boolean;
  title: string;
  description: string;
  disclaimer: string;
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
  source: string;
  isSponsored: boolean;
  confidenceScore: number;
  evidenceText: string;
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
