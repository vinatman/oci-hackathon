import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const addDays = (days: number, hour = 19) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hour, 0, 0, 0);
  return date;
};

const teams = [
  { name: "Dallas Cowboys", sport: "Football", league: "NFL", city: "Dallas", country: "USA" },
  { name: "San Francisco 49ers", sport: "Football", league: "NFL", city: "San Francisco", country: "USA" },
  { name: "Los Angeles Lakers", sport: "Basketball", league: "NBA", city: "Los Angeles", country: "USA" },
  { name: "Boston Celtics", sport: "Basketball", league: "NBA", city: "Boston", country: "USA" },
  { name: "New York Yankees", sport: "Baseball", league: "MLB", city: "New York", country: "USA" },
  { name: "Chicago Cubs", sport: "Baseball", league: "MLB", city: "Chicago", country: "USA" },
  { name: "Boston Bruins", sport: "Hockey", league: "NHL", city: "Boston", country: "USA" },
  { name: "Vegas Golden Knights", sport: "Hockey", league: "NHL", city: "Las Vegas", country: "USA" },
  { name: "Arsenal", sport: "Soccer", league: "Premier League", city: "London", country: "England" },
  { name: "Manchester City", sport: "Soccer", league: "Premier League", city: "Manchester", country: "England" },
  { name: "Seattle Sounders", sport: "Soccer", league: "MLS", city: "Seattle", country: "USA" },
  { name: "LAFC", sport: "Soccer", league: "MLS", city: "Los Angeles", country: "USA" }
];

const venues = [
  {
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
    name: "LA Fan Club House",
    address: "1850 N Vermont Ave",
    city: "Los Angeles",
    state: "CA",
    country: "USA",
    latitude: 34.1053,
    longitude: -118.2911,
    venueType: "Fan club",
    description: "Seeded fan-club venue for Lakers and LAFC meetups.",
    rating: 4.0,
    source: "seed",
    isSponsored: false
  },
  {
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
    name: "Banners Kitchen & Tap",
    address: "82 Causeway St",
    city: "Boston",
    state: "MA",
    country: "USA",
    latitude: 42.3654,
    longitude: -71.0619,
    venueType: "Premium lounge",
    description: "Premium game-watching venue near TD Garden.",
    rating: 4.0,
    source: "seed",
    isSponsored: false
  },
  {
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
    name: "Blondies Sports Bar & Grill",
    address: "3663 Las Vegas Blvd S",
    city: "Las Vegas",
    state: "NV",
    country: "USA",
    latitude: 36.1106,
    longitude: -115.1709,
    venueType: "Sports bar",
    description: "Sports bar on the Strip with all-day game coverage.",
    rating: 4.0,
    source: "seed",
    isSponsored: false
  }
];

const adPlacements = [
  {
    placementKey: "sponsored-venue-top",
    title: "Game-day table packages",
    description: "Reserve a sponsored table bundle at select sports bars.",
    advertiserName: "FanSeat Local",
    targetUrl: "https://example.com/fanseat"
  },
  {
    placementKey: "local-rideshare",
    title: "Ride to the watch party",
    description: "Mock rideshare credit for fans heading to nearby venues.",
    advertiserName: "RideLoop",
    targetUrl: "https://example.com/rideloop"
  },
  {
    placementKey: "merch-drop",
    title: "Away-day merch picks",
    description: "Team-color fan gear curated for traveling supporters.",
    advertiserName: "KitCart",
    targetUrl: "https://example.com/kitcart"
  },
  {
    placementKey: "streaming-trial",
    title: "Backup streaming option",
    description: "Mock streaming partner for games not shown nearby.",
    advertiserName: "StreamDeck Sports",
    targetUrl: "https://example.com/streamdeck"
  },
  {
    placementKey: "food-special",
    title: "Halftime appetizer promo",
    description: "Sponsored food deals at participating venues.",
    advertiserName: "Bites Network",
    targetUrl: "https://example.com/bites"
  }
];

const partnerOffers = [
  {
    partnerType: "food",
    title: "Two-for-one wings",
    description: "Mock local food deal available near top sports bars.",
    ctaLabel: "View food deal",
    targetUrl: "https://example.com/food"
  },
  {
    partnerType: "rideshare",
    title: "Fan ride placeholder",
    description: "Future rideshare integration for traveling fans.",
    ctaLabel: "Plan ride",
    targetUrl: "https://example.com/rides"
  },
  {
    partnerType: "merchandise",
    title: "Team scarf bundle",
    description: "Mock merchandise offer for favorite team supporters.",
    ctaLabel: "Shop merch",
    targetUrl: "https://example.com/merch"
  },
  {
    partnerType: "streaming",
    title: "Streaming backup",
    description: "Fallback streaming partner placeholder when venues are full.",
    ctaLabel: "See options",
    targetUrl: "https://example.com/streaming"
  },
  {
    partnerType: "fan-club",
    title: "Join a local watch crew",
    description: "Fan community promotion for away supporters.",
    ctaLabel: "Find fan club",
    targetUrl: "https://example.com/fanclub"
  }
];

async function main() {
  await prisma.venueTeamAffinity.deleteMany();
  await prisma.userSavedVenue.deleteMany();
  await prisma.userFavoriteTeam.deleteMany();
  await prisma.searchHistory.deleteMany();
  await prisma.game.deleteMany();
  await prisma.venue.deleteMany();
  await prisma.userProfile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.team.deleteMany();
  await prisma.adPlacement.deleteMany();
  await prisma.partnerOffer.deleteMany();

  const createdTeams = new Map<string, string>();
  for (const team of teams) {
    const created = await prisma.team.create({ data: team });
    createdTeams.set(team.name, created.id);
  }

  const gameSeeds = [
    ["Los Angeles Lakers", "Boston Celtics", "Basketball", "NBA", 2, "Los Angeles", "CA", "National broadcast"],
    ["Dallas Cowboys", "San Francisco 49ers", "Football", "NFL", 3, "Dallas", "TX", "Sunday prime-time"],
    ["New York Yankees", "Chicago Cubs", "Baseball", "MLB", 4, "New York", "NY", "Regional broadcast"],
    ["Boston Bruins", "Vegas Golden Knights", "Hockey", "NHL", 5, "Boston", "MA", "Hockey night"],
    ["Arsenal", "Manchester City", "Soccer", "Premier League", 6, "London", undefined, "Morning kickoff"],
    ["Seattle Sounders", "LAFC", "Soccer", "MLS", 7, "Seattle", "WA", "Local broadcast"],
    ["Boston Celtics", "Los Angeles Lakers", "Basketball", "NBA", 8, "Boston", "MA", "Rivalry week"],
    ["San Francisco 49ers", "Dallas Cowboys", "Football", "NFL", 9, "San Francisco", "CA", "National broadcast"],
    ["Chicago Cubs", "New York Yankees", "Baseball", "MLB", 10, "Chicago", "IL", "Afternoon game"],
    ["Vegas Golden Knights", "Boston Bruins", "Hockey", "NHL", 11, "Las Vegas", "NV", "West coast puck drop"],
    ["Manchester City", "Arsenal", "Soccer", "Premier League", 12, "Manchester", undefined, "Early match"],
    ["LAFC", "Seattle Sounders", "Soccer", "MLS", 13, "Los Angeles", "CA", "Conference showdown"]
  ] as const;

  for (const [home, away, sport, league, days, city, state, broadcastInfo] of gameSeeds) {
    await prisma.game.create({
      data: {
        homeTeamId: createdTeams.get(home)!,
        awayTeamId: createdTeams.get(away)!,
        sport,
        league,
        startTime: addDays(days, league === "Premier League" ? 9 : 19),
        city,
        state,
        country: city === "London" || city === "Manchester" ? "England" : "USA",
        broadcastInfo,
        source: "seed"
      }
    });
  }

  const createdVenues = new Map<string, string>();
  for (const venue of venues) {
    const created = await prisma.venue.create({ data: venue });
    createdVenues.set(venue.name, created.id);
  }

  const affinities = [
    ["Tom's Watch Bar Los Angeles", "Los Angeles Lakers", 0.93, "Lakers watch parties, arena-adjacent, and basketball-heavy screens."],
    ["33 Taps Silver Lake", "LAFC", 0.83, "Mentions LAFC screens and soccer-friendly crowds."],
    ["Christies Sports Bar", "Dallas Cowboys", 0.9, "Classic Cowboys watch-party venue in Dallas."],
    ["Kezar Pub", "San Francisco 49ers", 0.86, "Known for 49ers regulars and NFL Sundays."],
    ["Stout NYC Penn Station", "New York Yankees", 0.82, "Yankees watch nights and big-game atmosphere."],
    ["Tony C's Sports Bar", "Boston Celtics", 0.88, "Strong Celtics watch-party fit with big screens."],
    ["Cask 'n Flagon", "Boston Bruins", 0.87, "Boston fan crowd with Bruins game-day history."],
    ["Beer Park", "Vegas Golden Knights", 0.8, "Golden Knights screens and large watch-party format."]
  ] as const;

  for (const [venueName, teamName, confidenceScore, evidenceText] of affinities) {
    await prisma.venueTeamAffinity.create({
      data: {
        venueId: createdVenues.get(venueName)!,
        teamId: createdTeams.get(teamName)!,
        confidenceScore,
        evidenceText
      }
    });
  }

  for (const ad of adPlacements) {
    await prisma.adPlacement.create({ data: { ...ad, active: true } });
  }

  for (const offer of partnerOffers) {
    await prisma.partnerOffer.create({ data: { ...offer, active: true } });
  }

  const demoUser = await prisma.user.create({
    data: {
      displayName: "Traveling Fan",
      homeCity: "Los Angeles",
      isPremium: false,
      profile: {
        create: {
          preferredSports: ["Basketball", "Football"],
          preferredLeagues: ["NBA", "NFL"],
          preferredVenueTypes: ["Sports bar", "Watch party"],
          travelModeEnabled: true
        }
      }
    }
  });

  await prisma.userFavoriteTeam.createMany({
    data: ["Los Angeles Lakers", "Dallas Cowboys"].map((name) => ({
      userId: demoUser.id,
      teamId: createdTeams.get(name)!
    }))
  });

  console.log("Seeded Sports Connect data.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
