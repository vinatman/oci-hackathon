import type {
  AdPlacement,
  AgentCard,
  BettingWidgetData,
  FavoriteTeam,
  Game,
  PartnerOffer,
  ReverseLocationResult,
  SavedVenue,
  Team,
  User,
  VenueSearchPayload,
  VenueSearchResponse
} from "../types/domain";
import { mockApi } from "./mockApi";

const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const localDevApiBaseUrl = import.meta.env.DEV ? ["http:", "//", "localhost", ":4000"].join("") : "";
const API_BASE_URL = configuredApiBaseUrl || localDevApiBaseUrl;

function isLocalhostApi(url: string) {
  return /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?(?:\/|$)/i.test(url);
}

export const usingMockApi =
  import.meta.env.VITE_USE_MOCK_API === "true" || !API_BASE_URL || (import.meta.env.PROD && isLocalhostApi(API_BASE_URL));

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    },
    ...options
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

const remoteApi = {
  createDemoUser(userId?: string) {
    return request<{ user: User }>("/api/demo-user", {
      method: "POST",
      body: JSON.stringify({ userId })
    });
  },
  getProfile(userId: string) {
    return request<{ user: User }>(`/api/users/${userId}/profile`);
  },
  updateProfile(userId: string, payload: unknown) {
    return request<{ user: User }>(`/api/users/${userId}/profile`, {
      method: "PUT",
      body: JSON.stringify(payload)
    });
  },
  getTeams(params: { sport?: string; league?: string; q?: string } = {}) {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => value && search.set(key, value));
    return request<{ teams: Team[] }>(`/api/teams${search.size ? `?${search}` : ""}`);
  },
  getFavoriteTeams(userId: string) {
    return request<{ favoriteTeams: FavoriteTeam[] }>(`/api/users/${userId}/favorite-teams`);
  },
  addFavoriteTeam(userId: string, teamId: string) {
    return request<{ favoriteTeam: FavoriteTeam }>(`/api/users/${userId}/favorite-teams`, {
      method: "POST",
      body: JSON.stringify({ teamId })
    });
  },
  removeFavoriteTeam(userId: string, teamId: string) {
    return request<void>(`/api/users/${userId}/favorite-teams/${teamId}`, {
      method: "DELETE"
    });
  },
  getUpcomingGames(params: { sport?: string; league?: string; teamId?: string } = {}) {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => value && search.set(key, value));
    return request<{ games: Game[] }>(`/api/games/upcoming${search.size ? `?${search}` : ""}`);
  },
  reverseLocation(latitude: number, longitude: number) {
    const search = new URLSearchParams({ lat: String(latitude), lng: String(longitude) });
    return request<ReverseLocationResult>(`/api/location/reverse?${search}`);
  },
  searchVenues(userId: string, payload: VenueSearchPayload) {
    return request<VenueSearchResponse>(`/api/users/${userId}/venues/search`, {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },
  getSavedVenues(userId: string) {
    return request<{ savedVenues: SavedVenue[] }>(`/api/users/${userId}/saved-venues`);
  },
  saveVenue(userId: string, venueId: string, notes?: string) {
    return request<{ savedVenue: SavedVenue }>(`/api/users/${userId}/saved-venues/${venueId}`, {
      method: "POST",
      body: JSON.stringify({ notes })
    });
  },
  removeSavedVenue(userId: string, venueId: string) {
    return request<void>(`/api/users/${userId}/saved-venues/${venueId}`, {
      method: "DELETE"
    });
  },
  getAgentRecommendations(userId: string, payload: VenueSearchPayload) {
    return request<{ recommendations: AgentCard[] }>(`/api/users/${userId}/agent/recommendations`, {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },
  sendAssistantMessage(userId: string, payload: { message: string; context?: Record<string, unknown> }) {
    return request<Record<string, unknown>>(`/api/users/${userId}/assistant/message`, {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },
  getTickets(gameId?: string) {
    const search = gameId ? `?gameId=${encodeURIComponent(gameId)}` : "";
    return request<{ offers: unknown[]; enabled: boolean }>(`/api/monetization/tickets${search}`);
  },
  getBetting() {
    return request<BettingWidgetData>("/api/monetization/betting");
  },
  getAds(userId?: string) {
    const search = userId ? `?userId=${encodeURIComponent(userId)}` : "";
    return request<{ ads: AdPlacement[]; enabled: boolean; premiumAdsHidden?: boolean }>(`/api/monetization/ads${search}`);
  },
  getPromotions() {
    return request<{ promotions: PartnerOffer[]; enabled: boolean }>("/api/monetization/promotions");
  }
};

export const api = usingMockApi ? mockApi : remoteApi;
