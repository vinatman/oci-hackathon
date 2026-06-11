import type {
  AdPlacement,
  AgentCard,
  BettingWidgetData,
  FavoriteTeam,
  Game,
  PartnerOffer,
  RankedVenue,
  SavedVenue,
  Team,
  TicketOffer,
  User,
  VenueSearchPayload,
  VenueSearchResponse
} from "../types/domain";

type SeedVenue = Omit<RankedVenue, "confidenceScore" | "evidenceText" | "distanceKm" | "relevantGame" | "monetizationCta"> & {
  source: string;
};

interface VenueAffinity {
  venueId: string;
  teamId: string;
  confidenceScore: number;
  evidenceText: string;
}

interface MockState {
  user: User;
  savedVenues: Array<{ venueId: string; notes?: string; createdAt: string }>;
}

const STATE_KEY = "sports-connect-public-demo-state-v1";

const teams: Team[] = [
  { id: "team-cowboys", name: "Dallas Cowboys", sport: "Football", league: "NFL", city: "Dallas", country: "USA" },
  { id: "team-49ers", name: "San Francisco 49ers", sport: "Football", league: "NFL", city: "San Francisco", country: "USA" },
  { id: "team-lakers", name: "Los Angeles Lakers", sport: "Basketball", league: "NBA", city: "Los Angeles", country: "USA" },
  { id: "team-celtics", name: "Boston Celtics", sport: "Basketball", league: "NBA", city: "Boston", country: "USA" },
  { id: "team-yankees", name: "New York Yankees", sport: "Baseball", league: "MLB", city: "New York", country: "USA" },
  { id: "team-cubs", name: "Chicago Cubs", sport: "Baseball", league: "MLB", city: "Chicago", country: "USA" },
  { id: "team-bruins", name: "Boston Bruins", sport: "Hockey", league: "NHL", city: "Boston", country: "USA" },
  { id: "team-golden-knights", name: "Vegas Golden Knights", sport: "Hockey", league: "NHL", city: "Las Vegas", country: "USA" },
  { id: "team-arsenal", name: "Arsenal", sport: "Soccer", league: "Premier League", city: "London", country: "England" },
  { id: "team-man-city", name: "Manchester City", sport: "Soccer", league: "Premier League", city: "Manchester", country: "England" },
  { id: "team-sounders", name: "Seattle Sounders", sport: "Soccer", league: "MLS", city: "Seattle", country: "USA" },
  { id: "team-lafc", name: "LAFC", sport: "Soccer", league: "MLS", city: "Los Angeles", country: "USA" }
];

const teamById = new Map(teams.map((team) => [team.id, team]));

const gameSeeds = [
  ["game-lakers-celtics", "team-lakers", "team-celtics", "Basketball", "NBA", 2, "Los Angeles", "CA", "National broadcast"],
  ["game-cowboys-49ers", "team-cowboys", "team-49ers", "Football", "NFL", 3, "Dallas", "TX", "Sunday prime-time"],
  ["game-yankees-cubs", "team-yankees", "team-cubs", "Baseball", "MLB", 4, "New York", "NY", "Regional broadcast"],
  ["game-bruins-knights", "team-bruins", "team-golden-knights", "Hockey", "NHL", 5, "Boston", "MA", "Hockey night"],
  ["game-arsenal-city", "team-arsenal", "team-man-city", "Soccer", "Premier League", 6, "London", undefined, "Morning kickoff"],
  ["game-sounders-lafc", "team-sounders", "team-lafc", "Soccer", "MLS", 7, "Seattle", "WA", "Local broadcast"],
  ["game-celtics-lakers", "team-celtics", "team-lakers", "Basketball", "NBA", 8, "Boston", "MA", "Rivalry week"],
  ["game-49ers-cowboys", "team-49ers", "team-cowboys", "Football", "NFL", 9, "San Francisco", "CA", "National broadcast"],
  ["game-cubs-yankees", "team-cubs", "team-yankees", "Baseball", "MLB", 10, "Chicago", "IL", "Afternoon game"],
  ["game-knights-bruins", "team-golden-knights", "team-bruins", "Hockey", "NHL", 11, "Las Vegas", "NV", "West coast puck drop"],
  ["game-city-arsenal", "team-man-city", "team-arsenal", "Soccer", "Premier League", 12, "Manchester", undefined, "Early match"],
  ["game-lafc-sounders", "team-lafc", "team-sounders", "Soccer", "MLS", 13, "Los Angeles", "CA", "Conference showdown"]
] as const;

const venues: SeedVenue[] = [
  {
    id: "venue-stout-nyc",
    name: "Stout NYC Penn Station",
    address: "133 W 33rd St",
    city: "New York",
    state: "NY",
    country: "USA",
    latitude: 40.7507,
    longitude: -73.9897,
    venueType: "Sports bar",
    description: "Multi-screen sports bar with Yankees watch nights and commuter-friendly game-day crowds.",
    rating: 4.4,
    source: "seed",
    isSponsored: true
  },
  {
    id: "venue-smithfield-hall",
    name: "Smithfield Hall",
    address: "138 W 25th St",
    city: "New York",
    state: "NY",
    country: "USA",
    latitude: 40.7449,
    longitude: -73.9935,
    venueType: "Pub",
    description: "Soccer pub known for Premier League mornings and fan-club meetups.",
    rating: 4.5,
    source: "seed",
    isSponsored: false
  },
  {
    id: "venue-kezar-pub",
    name: "Kezar Pub",
    address: "770 Stanyan St",
    city: "San Francisco",
    state: "CA",
    country: "USA",
    latitude: 37.7672,
    longitude: -122.4537,
    venueType: "Pub",
    description: "Neighborhood pub near Golden Gate Park with 49ers regulars and NFL Sunday coverage.",
    rating: 4.3,
    source: "seed",
    isSponsored: false
  },
  {
    id: "venue-golden-gate-tap-room",
    name: "Golden Gate Tap Room",
    address: "449 Powell St",
    city: "San Francisco",
    state: "CA",
    country: "USA",
    latitude: 37.7894,
    longitude: -122.4084,
    venueType: "Sports bar",
    description: "Downtown sports bar with big screens, arcade games, and Bay Area team coverage.",
    rating: 4.1,
    source: "seed",
    isSponsored: true
  },
  {
    id: "venue-hi-tops-sf",
    name: "Hi Tops SF",
    address: "2247 Market St",
    city: "San Francisco",
    state: "CA",
    country: "USA",
    latitude: 37.7657,
    longitude: -122.4323,
    venueType: "Watch party",
    description: "High-energy watch party spot with basketball and soccer groups.",
    rating: 4.4,
    source: "seed",
    isSponsored: false
  },
  {
    id: "venue-toms-watch-bar-la",
    name: "Tom's Watch Bar Los Angeles",
    address: "1011 S Figueroa St",
    city: "Los Angeles",
    state: "CA",
    country: "USA",
    latitude: 34.0435,
    longitude: -118.2664,
    venueType: "Sports bar",
    description: "Large-format sports bar near the arena with Lakers game-day energy.",
    rating: 4.2,
    source: "seed",
    isSponsored: true
  },
  {
    id: "venue-33-taps",
    name: "33 Taps Silver Lake",
    address: "3725 Sunset Blvd",
    city: "Los Angeles",
    state: "CA",
    country: "USA",
    latitude: 34.0914,
    longitude: -118.2799,
    venueType: "Restaurant",
    description: "Casual restaurant and bar with LAFC and Lakers screens.",
    rating: 4.3,
    source: "seed",
    isSponsored: false
  },
  {
    id: "venue-la-fan-club-house",
    name: "LA Fan Club House",
    address: "1850 N Vermont Ave",
    city: "Los Angeles",
    state: "CA",
    country: "USA",
    latitude: 34.1053,
    longitude: -118.2911,
    venueType: "Fan club",
    description: "Seeded fan-club venue for Lakers and LAFC meetups.",
    rating: 4,
    source: "seed",
    isSponsored: false
  },
  {
    id: "venue-theory",
    name: "Theory",
    address: "9 W Hubbard St",
    city: "Chicago",
    state: "IL",
    country: "USA",
    latitude: 41.8901,
    longitude: -87.6285,
    venueType: "Sports bar",
    description: "River North sports bar with Cubs, NFL, and basketball coverage.",
    rating: 4.2,
    source: "seed",
    isSponsored: true
  },
  {
    id: "venue-globe-pub",
    name: "The Globe Pub",
    address: "1934 W Irving Park Rd",
    city: "Chicago",
    state: "IL",
    country: "USA",
    latitude: 41.954,
    longitude: -87.6791,
    venueType: "Pub",
    description: "Soccer-forward pub that also draws Cubs fans on game days.",
    rating: 4.6,
    source: "seed",
    isSponsored: false
  },
  {
    id: "venue-hero-dallas",
    name: "HERO by HG",
    address: "3090 Olive St",
    city: "Dallas",
    state: "TX",
    country: "USA",
    latitude: 32.7909,
    longitude: -96.8103,
    venueType: "Premium lounge",
    description: "Premium sports lounge near Victory Park with Cowboys and Mavericks crowds.",
    rating: 4.4,
    source: "seed",
    isSponsored: true
  },
  {
    id: "venue-christies",
    name: "Christies Sports Bar",
    address: "2811 McKinney Ave",
    city: "Dallas",
    state: "TX",
    country: "USA",
    latitude: 32.7982,
    longitude: -96.8014,
    venueType: "Sports bar",
    description: "Classic Dallas sports bar with Cowboys watch parties.",
    rating: 4.2,
    source: "seed",
    isSponsored: false
  },
  {
    id: "venue-rustic-dallas",
    name: "The Rustic Dallas",
    address: "3656 Howell St",
    city: "Dallas",
    state: "TX",
    country: "USA",
    latitude: 32.8074,
    longitude: -96.7969,
    venueType: "Restaurant",
    description: "Open-air food and music venue with big-game patio screens.",
    rating: 4.3,
    source: "seed",
    isSponsored: false
  },
  {
    id: "venue-cask-flagon",
    name: "Cask 'n Flagon",
    address: "62 Brookline Ave",
    city: "Boston",
    state: "MA",
    country: "USA",
    latitude: 42.347,
    longitude: -71.0968,
    venueType: "Sports bar",
    description: "Fenway sports bar with Bruins, Celtics, and Boston fan crowds.",
    rating: 4.2,
    source: "seed",
    isSponsored: false
  },
  {
    id: "venue-tony-cs",
    name: "Tony C's Sports Bar",
    address: "699 Assembly Row",
    city: "Boston",
    state: "MA",
    country: "USA",
    latitude: 42.3942,
    longitude: -71.079,
    venueType: "Sports bar",
    description: "Big-screen sports bar with strong Celtics watch-party fit.",
    rating: 4.1,
    source: "seed",
    isSponsored: true
  },
  {
    id: "venue-banners",
    name: "Banners Kitchen & Tap",
    address: "82 Causeway St",
    city: "Boston",
    state: "MA",
    country: "USA",
    latitude: 42.3654,
    longitude: -71.0619,
    venueType: "Premium lounge",
    description: "Premium game-watching venue near TD Garden.",
    rating: 4,
    source: "seed",
    isSponsored: false
  },
  {
    id: "venue-buckleys",
    name: "Buckley's in Belltown",
    address: "2331 2nd Ave",
    city: "Seattle",
    state: "WA",
    country: "USA",
    latitude: 47.6141,
    longitude: -122.3464,
    venueType: "Sports bar",
    description: "Belltown sports bar with Sounders, Seahawks, and Mariners fans.",
    rating: 4.3,
    source: "seed",
    isSponsored: false
  },
  {
    id: "venue-flatstick",
    name: "Flatstick Pub Pioneer Square",
    address: "240 2nd Ave S",
    city: "Seattle",
    state: "WA",
    country: "USA",
    latitude: 47.6001,
    longitude: -122.3319,
    venueType: "Pub",
    description: "Casual pub close to stadiums with Sounders matchday traffic.",
    rating: 4.5,
    source: "seed",
    isSponsored: true
  },
  {
    id: "venue-beer-park",
    name: "Beer Park",
    address: "3655 S Las Vegas Blvd",
    city: "Las Vegas",
    state: "NV",
    country: "USA",
    latitude: 36.1126,
    longitude: -115.1728,
    venueType: "Watch party",
    description: "Rooftop watch party venue with Golden Knights and NFL screens.",
    rating: 4.3,
    source: "seed",
    isSponsored: true
  },
  {
    id: "venue-blondies",
    name: "Blondies Sports Bar & Grill",
    address: "3663 Las Vegas Blvd S",
    city: "Las Vegas",
    state: "NV",
    country: "USA",
    latitude: 36.1106,
    longitude: -115.1709,
    venueType: "Sports bar",
    description: "Sports bar on the Strip with all-day game coverage.",
    rating: 4,
    source: "seed",
    isSponsored: false
  }
];

const affinities: VenueAffinity[] = [
  {
    venueId: "venue-toms-watch-bar-la",
    teamId: "team-lakers",
    confidenceScore: 0.93,
    evidenceText: "Lakers watch parties, arena-adjacent, and basketball-heavy screens."
  },
  {
    venueId: "venue-33-taps",
    teamId: "team-lafc",
    confidenceScore: 0.83,
    evidenceText: "Mentions LAFC screens and soccer-friendly crowds."
  },
  {
    venueId: "venue-christies",
    teamId: "team-cowboys",
    confidenceScore: 0.9,
    evidenceText: "Classic Cowboys watch-party venue in Dallas."
  },
  {
    venueId: "venue-kezar-pub",
    teamId: "team-49ers",
    confidenceScore: 0.86,
    evidenceText: "Known for 49ers regulars and NFL Sundays."
  },
  {
    venueId: "venue-stout-nyc",
    teamId: "team-yankees",
    confidenceScore: 0.82,
    evidenceText: "Yankees watch nights and big-game atmosphere."
  },
  {
    venueId: "venue-tony-cs",
    teamId: "team-celtics",
    confidenceScore: 0.88,
    evidenceText: "Strong Celtics watch-party fit with big screens."
  },
  {
    venueId: "venue-cask-flagon",
    teamId: "team-bruins",
    confidenceScore: 0.87,
    evidenceText: "Boston fan crowd with Bruins game-day history."
  },
  {
    venueId: "venue-beer-park",
    teamId: "team-golden-knights",
    confidenceScore: 0.8,
    evidenceText: "Golden Knights screens and large watch-party format."
  }
];

const ads: AdPlacement[] = [
  {
    id: "ad-table-packages",
    placementKey: "sponsored-venue-top",
    title: "Game-day table packages",
    description: "Reserve a sponsored table bundle at select sports bars.",
    advertiserName: "FanSeat Local",
    targetUrl: "https://example.com/fanseat"
  },
  {
    id: "ad-rideshare",
    placementKey: "local-rideshare",
    title: "Ride to the watch party",
    description: "Mock rideshare credit for fans heading to nearby venues.",
    advertiserName: "RideLoop",
    targetUrl: "https://example.com/rideloop"
  },
  {
    id: "ad-merch",
    placementKey: "merch-drop",
    title: "Away-day merch picks",
    description: "Team-color fan gear curated for traveling supporters.",
    advertiserName: "KitCart",
    targetUrl: "https://example.com/kitcart"
  },
  {
    id: "ad-streaming",
    placementKey: "streaming-trial",
    title: "Backup streaming option",
    description: "Mock streaming partner for games not shown nearby.",
    advertiserName: "StreamDeck Sports",
    targetUrl: "https://example.com/streamdeck"
  },
  {
    id: "ad-food",
    placementKey: "food-special",
    title: "Halftime appetizer promo",
    description: "Sponsored food deals at participating venues.",
    advertiserName: "Bites Network",
    targetUrl: "https://example.com/bites"
  }
];

const promotions: PartnerOffer[] = [
  {
    id: "promo-food",
    partnerType: "food",
    title: "Two-for-one wings",
    description: "Mock local food deal available near top sports bars.",
    ctaLabel: "View food deal",
    targetUrl: "https://example.com/food"
  },
  {
    id: "promo-rideshare",
    partnerType: "rideshare",
    title: "Fan ride placeholder",
    description: "Future rideshare integration for traveling fans.",
    ctaLabel: "Plan ride",
    targetUrl: "https://example.com/rides"
  },
  {
    id: "promo-merch",
    partnerType: "merchandise",
    title: "Team scarf bundle",
    description: "Mock merchandise offer for favorite team supporters.",
    ctaLabel: "Shop merch",
    targetUrl: "https://example.com/merch"
  },
  {
    id: "promo-streaming",
    partnerType: "streaming",
    title: "Streaming backup",
    description: "Fallback streaming partner placeholder when venues are full.",
    ctaLabel: "See options",
    targetUrl: "https://example.com/streaming"
  },
  {
    id: "promo-fan-club",
    partnerType: "fan-club",
    title: "Join a local watch crew",
    description: "Fan community promotion for away supporters.",
    ctaLabel: "Find fan club",
    targetUrl: "https://example.com/fanclub"
  }
];

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

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function addDays(days: number, hour = 19) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
}

function buildGames(): Game[] {
  return gameSeeds.map(([id, homeTeamId, awayTeamId, sport, league, days, city, state, broadcastInfo]) => ({
    id,
    homeTeamId,
    awayTeamId,
    sport,
    league,
    startTime: addDays(days, league === "Premier League" ? 9 : 19),
    city,
    state,
    country: city === "London" || city === "Manchester" ? "England" : "USA",
    broadcastInfo,
    homeTeam: teamById.get(homeTeamId)!,
    awayTeam: teamById.get(awayTeamId)!
  }));
}

function favoriteFor(userId: string, teamId: string): FavoriteTeam {
  return {
    id: `favorite-${userId}-${teamId}`,
    userId,
    teamId,
    team: teamById.get(teamId)!
  };
}

function initialState(): MockState {
  const userId = "public-demo-user";
  return {
    user: {
      id: userId,
      displayName: "Traveling Fan",
      homeCity: "Los Angeles",
      isPremium: false,
      profile: {
        id: "public-demo-profile",
        userId,
        preferredSports: ["Basketball", "Football"],
        preferredLeagues: ["NBA", "NFL"],
        preferredVenueTypes: ["Sports bar", "Watch party"],
        travelModeEnabled: true
      },
      favoriteTeams: [favoriteFor(userId, "team-lakers"), favoriteFor(userId, "team-cowboys")]
    },
    savedVenues: []
  };
}

function loadState(): MockState {
  const raw = localStorage.getItem(STATE_KEY);
  if (!raw) {
    const state = initialState();
    saveState(state);
    return state;
  }

  try {
    const parsed = JSON.parse(raw) as MockState;
    if (!parsed.user?.id) {
      throw new Error("Invalid demo state");
    }
    return parsed;
  } catch {
    const state = initialState();
    saveState(state);
    return state;
  }
}

function saveState(state: MockState) {
  localStorage.setItem(STATE_KEY, JSON.stringify(state));
}

function normalizedCity(city?: string) {
  return city?.trim().toLowerCase();
}

function selectedLocation(input: VenueSearchPayload) {
  if (typeof input.latitude === "number" && typeof input.longitude === "number") {
    return { latitude: input.latitude, longitude: input.longitude };
  }
  const city = normalizedCity(input.city);
  return city ? cityCenters[city] : undefined;
}

function haversineKm(from: { latitude: number; longitude: number }, to: { latitude: number; longitude: number }) {
  const earthRadiusKm = 6371;
  const dLat = degreesToRadians(to.latitude - from.latitude);
  const dLon = degreesToRadians(to.longitude - from.longitude);
  const lat1 = degreesToRadians(from.latitude);
  const lat2 = degreesToRadians(to.latitude);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  return earthRadiusKm * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function degreesToRadians(value: number) {
  return (value * Math.PI) / 180;
}

function relevantAffinity(venueId: string, teamId?: string) {
  if (teamId) {
    return affinities.find((affinity) => affinity.venueId === venueId && affinity.teamId === teamId);
  }
  return affinities
    .filter((affinity) => affinity.venueId === venueId)
    .sort((a, b) => b.confidenceScore - a.confidenceScore)[0];
}

function scoreVenue({
  venue,
  search,
  affinity,
  distanceKm
}: {
  venue: SeedVenue;
  search: VenueSearchPayload;
  affinity?: VenueAffinity;
  distanceKm?: number;
}) {
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
    const radius = Math.max(search.radiusKm || 1, 1);
    const distanceBoost = Math.max(0, 0.18 * (1 - Math.min(distanceKm, radius) / radius));
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

function formatGameLabel(game: Game) {
  return `${game.awayTeam.name} at ${game.homeTeam.name}`;
}

function applyProfileDefaults(user: User, input: VenueSearchPayload): VenueSearchPayload {
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
    city: input.city ?? user.homeCity ?? undefined,
    venueTypes:
      input.venueTypes.length > 0
        ? input.venueTypes
        : user.profile?.preferredVenueTypes.length
          ? user.profile.preferredVenueTypes.slice(0, 2)
          : []
  };
}

function filterGames(input: VenueSearchPayload) {
  return buildGames()
    .filter((game) => new Date(game.startTime).getTime() >= Date.now())
    .filter((game) => !input.gameId || game.id === input.gameId)
    .filter((game) => !input.sport || game.sport === input.sport)
    .filter((game) => !input.league || game.league === input.league)
    .filter((game) => !input.teamId || game.homeTeamId === input.teamId || game.awayTeamId === input.teamId)
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(0, 8);
}

function ticketOffers(gameIds: string[]): TicketOffer[] {
  const templates = [
    ["ticket-marketplace", "Fan ticket marketplace", "Mock ticket marketplace listing for the selected game."],
    ["ticket-value", "Upper bowl value seats", "Sample value-seat option for fans who want to attend instead of watch nearby."],
    ["ticket-upgrade", "Lower bowl upgrade", "Mock premium-seat offer attached to the selected upcoming game."],
    ["ticket-family", "Family section option", "Sample family-friendly ticket block for traveling supporters."],
    ["ticket-last-minute", "Last-minute fan pass", "Mock last-minute ticket option for game-day decisions."]
  ] as const;

  return gameIds
    .flatMap((gameId) =>
      templates.map(([id, title, description], index) => ({
        id: `${id}-${gameId}`,
        gameId,
        title,
        description,
        ctaLabel: "Find tickets",
        targetUrl: `https://example.com/tickets/${index + 1}`
      }))
    )
    .slice(0, 5);
}

function bettingWidget(): BettingWidgetData {
  const enabled = import.meta.env.VITE_ENABLE_BETTING_WIDGET === "true";
  return {
    enabled,
    title: enabled ? "Betting partner placeholder" : "Betting partner disabled",
    description: enabled
      ? "Sample responsible gaming partner module. No odds, advice, or wagering is available."
      : "Betting is disabled by default for the MVP.",
    disclaimer: "Responsible gaming: this MVP does not provide betting advice, odds, deposits, or real-money wagering."
  };
}

function monetizationFor(user: User, gameIds: string[]): VenueSearchResponse["monetization"] {
  const ticketsEnabled = import.meta.env.VITE_ENABLE_TICKETS_WIDGET !== "false";
  const adsEnabled = import.meta.env.VITE_ENABLE_AD_WIDGET !== "false";
  const promotionsEnabled = import.meta.env.VITE_ENABLE_PARTNER_PROMOTIONS !== "false";

  return {
    tickets: ticketsEnabled && gameIds.length > 0 ? ticketOffers(gameIds) : [],
    betting: bettingWidget(),
    ads: adsEnabled && !user.isPremium ? clone(ads) : [],
    promotions: promotionsEnabled ? clone(promotions) : [],
    premiumAdsHidden: user.isPremium
  };
}

function buildAgentCards(input: {
  venues: RankedVenue[];
  games: Game[];
  tickets: TicketOffer[];
  ads: AdPlacement[];
  promotions: PartnerOffer[];
  isPremium: boolean;
  search: VenueSearchPayload;
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

function rankedVenuesFor(user: User, input: VenueSearchPayload, games: Game[]) {
  const origin = selectedLocation(input);
  const city = normalizedCity(input.city);
  const relevantGame = games[0]
    ? {
        id: games[0].id,
        label: formatGameLabel(games[0]),
        startTime: games[0].startTime
      }
    : undefined;

  let candidates = venues.filter((venue) => {
    if (city && venue.city.toLowerCase() !== city) return false;
    if (input.venueTypes.length > 0 && !input.venueTypes.includes(venue.venueType)) return false;
    return true;
  });

  if (candidates.length === 0 && input.venueTypes.length > 0) {
    candidates = venues.filter((venue) => !city || venue.city.toLowerCase() === city);
  }

  if (candidates.length === 0) {
    candidates = venues;
  }

  const ranked = candidates
    .map((venue): RankedVenue => {
      const distanceKm = origin ? haversineKm(origin, { latitude: venue.latitude, longitude: venue.longitude }) : undefined;
      const affinity = relevantAffinity(venue.id, input.teamId);
      const score = scoreVenue({ venue, search: input, affinity, distanceKm });
      return {
        ...venue,
        confidenceScore: score.confidenceScore,
        evidenceText: score.evidenceText,
        distanceKm,
        relevantGame,
        monetizationCta:
          venue.isSponsored && !user.isPremium ? { label: "Sponsored table option", kind: "sponsored" } : undefined
      };
    })
    .filter((venue) => (origin ? (venue.distanceKm ?? 0) <= input.radiusKm : true))
    .sort((a, b) => b.confidenceScore - a.confidenceScore);

  return ranked.length ? ranked.slice(0, 10) : candidates.slice(0, 10).map((venue) => {
    const score = scoreVenue({ venue, search: input, affinity: relevantAffinity(venue.id, input.teamId) });
    return {
      ...venue,
      confidenceScore: score.confidenceScore,
      evidenceText: score.evidenceText,
      relevantGame,
      monetizationCta:
        venue.isSponsored && !user.isPremium ? { label: "Sponsored table option", kind: "sponsored" as const } : undefined
    };
  });
}

function getRankedVenue(venueId: string, user: User) {
  const venue = venues.find((item) => item.id === venueId);
  if (!venue) return undefined;
  const favoriteTeam = user.favoriteTeams?.[0]?.team;
  const input = applyProfileDefaults(user, {
    sport: favoriteTeam?.sport,
    league: favoriteTeam?.league,
    teamId: favoriteTeam?.id,
    city: user.homeCity ?? undefined,
    venueTypes: user.profile?.preferredVenueTypes ?? [],
    radiusKm: 40
  });
  return rankedVenuesFor(user, input, filterGames(input)).find((item) => item.id === venueId);
}

export const mockApi = {
  async createDemoUser(userId?: string) {
    const state = loadState();
    if (userId && userId !== state.user.id) {
      saveState(initialState());
      return { user: clone(loadState().user) };
    }
    return { user: clone(state.user) };
  },
  async getProfile(userId: string) {
    const state = loadState();
    if (state.user.id !== userId) throw new Error("User not found");
    return { user: clone(state.user) };
  },
  async updateProfile(userId: string, payload: unknown) {
    const state = loadState();
    if (state.user.id !== userId) throw new Error("User not found");
    const value = payload as Partial<{
      displayName: string;
      homeCity: string;
      isPremium: boolean;
      preferredSports: string[];
      preferredLeagues: string[];
      preferredVenueTypes: string[];
      travelModeEnabled: boolean;
    }>;

    state.user = {
      ...state.user,
      displayName: value.displayName ?? state.user.displayName,
      homeCity: value.homeCity ?? state.user.homeCity,
      isPremium: value.isPremium ?? state.user.isPremium,
      profile: {
        id: state.user.profile?.id ?? "public-demo-profile",
        userId,
        preferredSports: value.preferredSports ?? state.user.profile?.preferredSports ?? [],
        preferredLeagues: value.preferredLeagues ?? state.user.profile?.preferredLeagues ?? [],
        preferredVenueTypes: value.preferredVenueTypes ?? state.user.profile?.preferredVenueTypes ?? [],
        travelModeEnabled: value.travelModeEnabled ?? state.user.profile?.travelModeEnabled ?? true
      }
    };
    saveState(state);
    return { user: clone(state.user) };
  },
  async getTeams(params: { sport?: string; league?: string; q?: string } = {}) {
    const query = params.q?.trim().toLowerCase();
    return {
      teams: clone(
        teams.filter((team) => {
          if (params.sport && team.sport !== params.sport) return false;
          if (params.league && team.league !== params.league) return false;
          if (query && !`${team.name} ${team.city} ${team.league}`.toLowerCase().includes(query)) return false;
          return true;
        })
      )
    };
  },
  async getFavoriteTeams(userId: string) {
    const state = loadState();
    if (state.user.id !== userId) throw new Error("User not found");
    return { favoriteTeams: clone(state.user.favoriteTeams ?? []) };
  },
  async addFavoriteTeam(userId: string, teamId: string) {
    const state = loadState();
    if (state.user.id !== userId) throw new Error("User not found");
    const team = teamById.get(teamId);
    if (!team) throw new Error("Team not found");
    const current = state.user.favoriteTeams ?? [];
    const existing = current.find((favorite) => favorite.teamId === teamId);
    const favoriteTeam = existing ?? favoriteFor(userId, teamId);
    state.user.favoriteTeams = existing ? current : [...current, favoriteTeam];
    saveState(state);
    return { favoriteTeam: clone(favoriteTeam) };
  },
  async removeFavoriteTeam(userId: string, teamId: string) {
    const state = loadState();
    if (state.user.id !== userId) throw new Error("User not found");
    state.user.favoriteTeams = (state.user.favoriteTeams ?? []).filter((favorite) => favorite.teamId !== teamId);
    saveState(state);
  },
  async getUpcomingGames(params: { sport?: string; league?: string; teamId?: string } = {}) {
    return { games: clone(filterGames({ ...params, venueTypes: [], radiusKm: 40 })) };
  },
  async searchVenues(userId: string, payload: VenueSearchPayload) {
    const state = loadState();
    if (state.user.id !== userId) throw new Error("User not found");
    const search = applyProfileDefaults(state.user, payload);
    const games = filterGames(search);
    const venues = rankedVenuesFor(state.user, search, games);
    const monetization = monetizationFor(state.user, search.gameId ? [search.gameId] : games.slice(0, 3).map((game) => game.id));
    const agentRecommendations = buildAgentCards({
      venues,
      games,
      tickets: monetization.tickets,
      ads: monetization.ads,
      promotions: monetization.promotions,
      isPremium: state.user.isPremium,
      search
    });

    return {
      games: clone(games),
      venues: clone(venues),
      agentRecommendations,
      monetization,
      mapAvailable: venues.some((venue) => typeof venue.latitude === "number" && typeof venue.longitude === "number")
    };
  },
  async getSavedVenues(userId: string) {
    const state = loadState();
    if (state.user.id !== userId) throw new Error("User not found");
    const savedVenues: SavedVenue[] = state.savedVenues.flatMap((saved) => {
      const venue = getRankedVenue(saved.venueId, state.user);
      if (!venue) return [];
      return [
        {
          id: `saved-${userId}-${saved.venueId}`,
          userId,
          venueId: saved.venueId,
          notes: saved.notes,
          createdAt: saved.createdAt,
          venue
        }
      ];
    });
    return { savedVenues: clone(savedVenues) };
  },
  async saveVenue(userId: string, venueId: string, notes?: string) {
    const state = loadState();
    if (state.user.id !== userId) throw new Error("User not found");
    if (!venues.some((venue) => venue.id === venueId)) throw new Error("Venue not found");
    const existing = state.savedVenues.find((saved) => saved.venueId === venueId);
    if (!existing) {
      state.savedVenues.push({ venueId, notes, createdAt: new Date().toISOString() });
    }
    saveState(state);
    const venue = getRankedVenue(venueId, state.user)!;
    return {
      savedVenue: {
        id: `saved-${userId}-${venueId}`,
        userId,
        venueId,
        notes: notes ?? existing?.notes,
        createdAt: existing?.createdAt ?? new Date().toISOString(),
        venue
      }
    };
  },
  async removeSavedVenue(userId: string, venueId: string) {
    const state = loadState();
    if (state.user.id !== userId) throw new Error("User not found");
    state.savedVenues = state.savedVenues.filter((saved) => saved.venueId !== venueId);
    saveState(state);
  },
  async getAgentRecommendations(userId: string, payload: VenueSearchPayload) {
    const response = await this.searchVenues(userId, payload);
    return { recommendations: response.agentRecommendations };
  },
  async sendAssistantMessage(
    userId: string,
    payload: { message: string; context?: Record<string, unknown> }
  ): Promise<Record<string, unknown>> {
    const state = loadState();
    if (state.user.id !== userId) throw new Error("User not found");
    const normalized = payload.message.toLowerCase();
    const context = payload.context;

    if (normalized.includes("save") && normalized.includes("top") && typeof context?.topVenueId === "string") {
      await this.saveVenue(userId, context.topVenueId, "Saved from assistant.");
      return { reply: "Saved the top venue for you.", actions: [{ type: "saved-venue", venueId: context.topVenueId }] };
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
      const games = filterGames({ sport: "Soccer", venueTypes: [], radiusKm: 40 }).slice(0, 4);
      return { reply: `I found ${games.length} upcoming soccer games.`, games };
    }

    if (normalized.includes("cowboys") || normalized.includes("lakers")) {
      const teamName = normalized.includes("cowboys") ? "Dallas Cowboys" : "Los Angeles Lakers";
      const team = teams.find((item) => item.name === teamName);
      const games = team ? filterGames({ teamId: team.id, venueTypes: [], radiusKm: 40 }).slice(0, 3) : [];
      return {
        reply: `I found ${games.length} upcoming ${teamName} game${games.length === 1 ? "" : "s"}. Try searching with that team selected.`,
        suggestedFilters: team ? { teamId: team.id, sport: team.sport, league: team.league } : undefined,
        games
      };
    }

    if (normalized.includes("ticket")) {
      const gameId = typeof context?.gameId === "string" ? context.gameId : undefined;
      const tickets = gameId ? ticketOffers([gameId]) : [];
      return {
        reply: tickets.length > 0 ? "Here are mock ticket options for the selected game." : "Select a game first and I can show ticket options.",
        tickets
      };
    }

    return {
      reply:
        "I can help with searches like finding a sports bar, switching to restaurants, showing soccer games, saving the top venue, or showing ticket options."
    };
  },
  async getTickets(gameId?: string) {
    return { offers: gameId ? ticketOffers([gameId]) : [], enabled: import.meta.env.VITE_ENABLE_TICKETS_WIDGET !== "false" };
  },
  async getBetting() {
    return bettingWidget();
  },
  async getAds(userId?: string) {
    const state = loadState();
    const isPremium = userId ? state.user.id === userId && state.user.isPremium : false;
    const enabled = import.meta.env.VITE_ENABLE_AD_WIDGET !== "false";
    return { ads: enabled && !isPremium ? clone(ads) : [], enabled, premiumAdsHidden: isPremium };
  },
  async getPromotions() {
    const enabled = import.meta.env.VITE_ENABLE_PARTNER_PROMOTIONS !== "false";
    return { promotions: enabled ? clone(promotions) : [], enabled };
  }
};
