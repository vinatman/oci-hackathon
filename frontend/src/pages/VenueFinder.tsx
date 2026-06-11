import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import { AgentRecommendationSidebar } from "../components/AgentRecommendationSidebar";
import { AssistantChatPanel } from "../components/AssistantChatPanel";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";
import { GameDayExtras } from "../components/GameDayExtras";
import { GameCard } from "../components/GameCard";
import { LeagueSelector } from "../components/LeagueSelector";
import { LoadingState } from "../components/LoadingState";
import { LocationPicker, type LocationState } from "../components/LocationPicker";
import { PageHeader } from "../components/PageHeader";
import { PremiumBadge } from "../components/PremiumBadge";
import { RadiusSelector } from "../components/RadiusSelector";
import { ResultsViewToggle } from "../components/ResultsViewToggle";
import { SportSelector } from "../components/SportSelector";
import { TeamSelector } from "../components/TeamSelector";
import { VenueListView } from "../components/VenueListView";
import { VenueMapView } from "../components/VenueMapView";
import { VenueTypeSelector } from "../components/VenueTypeSelector";
import { useDemoUser } from "../hooks/useDemoUser";
import type { Game, Team, VenueSearchPayload, VenueSearchResponse } from "../types/domain";
import {
  coerceResultsViewMode,
  getStoredResultsViewMode,
  storeResultsViewMode,
  type ResultsViewMode
} from "../utils/resultsViewMode";
import { formatGameLabel } from "../utils/format";

export function VenueFinder() {
  const { user, userId } = useDemoUser();
  const [teams, setTeams] = useState<Team[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [sport, setSport] = useState("");
  const [league, setLeague] = useState("");
  const [teamId, setTeamId] = useState("");
  const [gameId, setGameId] = useState("");
  const [venueTypes, setVenueTypes] = useState<string[]>([]);
  const [radiusKm, setRadiusKm] = useState(40);
  const [location, setLocation] = useState<LocationState>({
    mode: "manual",
    city: "Los Angeles",
    locationSource: "demo",
    status: "Use current location or enter a city manually.",
    statusKind: "idle"
  });
  const [results, setResults] = useState<VenueSearchResponse>();
  const [viewMode, setViewMode] = useState<ResultsViewMode>(() => getStoredResultsViewMode());
  const [loading, setLoading] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    if (!user) {
      return;
    }
    const profile = user.profile;
    const preferredSport = profile?.preferredSports?.[0];
    const preferredLeague = profile?.preferredLeagues?.[0];
    const matchingFavorite = user.favoriteTeams?.find(({ team }) => {
      if (preferredSport && team.sport !== preferredSport) return false;
      if (preferredLeague && team.league !== preferredLeague) return false;
      return true;
    })?.team;
    const favorite = matchingFavorite ?? (!preferredSport && !preferredLeague ? user.favoriteTeams?.[0]?.team : undefined);
    setSport(preferredSport ?? favorite?.sport ?? "");
    setLeague(preferredLeague ?? favorite?.league ?? "");
    setTeamId(favorite?.id ?? "");
    setVenueTypes(profile?.preferredVenueTypes?.length ? profile.preferredVenueTypes.slice(0, 2) : ["Sports bar"]);
    setLocation((current) => ({
      ...current,
      city: user.homeCity ?? "Los Angeles",
      locationSource: user.homeCity ? "profile" : current.locationSource,
      status: user.homeCity ? "Home city loaded from profile." : current.status,
      statusKind: "idle"
    }));
  }, [user]);

  useEffect(() => {
    const load = async () => {
      const [teamResponse, gameResponse] = await Promise.all([api.getTeams(), api.getUpcomingGames()]);
      setTeams(teamResponse.teams);
      setGames(gameResponse.games);
      setInitialLoading(false);
    };
    void load();
  }, []);

  useEffect(() => {
    if (results) {
      setViewMode((current) => coerceResultsViewMode(current, results.mapAvailable));
    }
  }, [results]);

  const filteredTeams = useMemo(
    () =>
      teams.filter((team) => {
        if (sport && team.sport !== sport) return false;
        if (league && team.league !== league) return false;
        return true;
      }),
    [league, sport, teams]
  );

  const filteredGames = useMemo(
    () =>
      games.filter((game) => {
        if (sport && game.sport !== sport) return false;
        if (league && game.league !== league) return false;
        if (teamId && game.homeTeamId !== teamId && game.awayTeamId !== teamId) return false;
        return true;
      }),
    [games, league, sport, teamId]
  );

  const payload: VenueSearchPayload = {
    sport: sport || undefined,
    league: league || undefined,
    teamId: teamId || undefined,
    gameId: gameId || undefined,
    city: location.mode === "manual" ? location.city || undefined : undefined,
    latitude: location.mode === "current" ? location.latitude : undefined,
    longitude: location.mode === "current" ? location.longitude : undefined,
    venueTypes,
    radiusKm
  };

  const getBrowserPosition = () =>
    new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      });
    });

  const detectCurrentLocation = async () => {
    if (!navigator.geolocation) {
      setLocation((current) => ({
        ...current,
        mode: "manual",
        latitude: undefined,
        longitude: undefined,
        locationSource: "manual",
        status: "Your browser does not support location detection. Please enter a city manually.",
        statusKind: "error"
      }));
      return;
    }

    setDetectingLocation(true);
    setError("");
    setLocation((current) => ({
      ...current,
      mode: "current",
      latitude: undefined,
      longitude: undefined,
      city: "",
      region: undefined,
      country: undefined,
      displayName: undefined,
      locationSource: "browser",
      status: "Detecting your location...",
      statusKind: "loading"
    }));

    try {
      const position = await getBrowserPosition();
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      setLocation((current) => ({
        ...current,
        mode: "current",
        city: "",
        region: undefined,
        country: undefined,
        displayName: undefined,
        latitude,
        longitude,
        locationSource: "browser",
        status: "Location detected. Looking up a nearby city...",
        statusKind: "loading"
      }));

      try {
        const reverse = await api.reverseLocation(latitude, longitude);
        const cityLabel = [reverse.city, reverse.state].filter(Boolean).join(", ");
        setLocation({
          mode: "current",
          city: reverse.city ?? "",
          region: reverse.state,
          country: reverse.country,
          displayName: reverse.displayName,
          latitude,
          longitude,
          locationSource: "browser",
          status: cityLabel
            ? `Location detected: ${cityLabel}.`
            : `Location detected. Reverse geocoding failed, but coordinates are available.`,
          statusKind: "success"
        });
      } catch {
        setLocation({
          mode: "current",
          city: "",
          latitude,
          longitude,
          locationSource: "browser",
          status: "Location detected. Reverse geocoding failed, but coordinates are available.",
          statusKind: "success"
        });
      }
    } catch (err) {
      const geolocationError = err as GeolocationPositionError;
      const status =
        geolocationError.code === geolocationError.PERMISSION_DENIED
          ? "Location permission was denied. You can still enter a city manually."
          : geolocationError.code === geolocationError.TIMEOUT
            ? "We could not detect your location quickly enough. Try again or enter a city manually."
            : "Location unavailable. Try again or enter a city manually.";

      setLocation((current) => ({
        ...current,
        mode: "manual",
        latitude: undefined,
        longitude: undefined,
        locationSource: current.city ? current.locationSource : "manual",
        status,
        statusKind: "error"
      }));
    } finally {
      setDetectingLocation(false);
    }
  };

  const search = async () => {
    if (!userId) return;
    setLoading(true);
    setError("");
    setSaveMessage("");
    try {
      const response = await api.searchVenues(userId, payload);
      setResults(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Venue search failed.");
    } finally {
      setLoading(false);
    }
  };

  const saveVenue = async (venueId: string) => {
    if (!userId) return;
    await api.saveVenue(userId, venueId);
    setSaveMessage("Venue saved.");
  };

  const changeViewMode = (mode: ResultsViewMode) => {
    setViewMode(mode);
    storeResultsViewMode(mode);
  };

  const applySuggestedFilters = (filters: Record<string, unknown>) => {
    if (Array.isArray(filters.venueTypes)) {
      setVenueTypes(filters.venueTypes.filter((value): value is string => typeof value === "string"));
    }
    if (typeof filters.sport === "string") setSport(filters.sport);
    if (typeof filters.league === "string") setLeague(filters.league);
    if (typeof filters.teamId === "string") setTeamId(filters.teamId);
  };

  if (!user || !userId || initialLoading) {
    return <LoadingState label="Loading venue finder" />;
  }

  const userLocation =
    location.mode === "current" && typeof location.latitude === "number" && typeof location.longitude === "number"
      ? { latitude: location.latitude, longitude: location.longitude }
      : undefined;

  return (
    <>
      <PageHeader title="Let's find your spot" eyebrow={`Hey ${user.displayName}!`}>
        <PremiumBadge active={user.isPremium} />
      </PageHeader>

      <section className="app-card mb-6 grid gap-5 p-4 sm:p-5">
        <div className="grid gap-4 md:grid-cols-3">
          <SportSelector value={sport} onChange={setSport} />
          <LeagueSelector value={league} onChange={setLeague} />
          <TeamSelector teams={filteredTeams} value={teamId} onChange={setTeamId} />
        </div>

        <label className="block text-sm font-medium text-ink">
          Upcoming game
          <select
            value={gameId}
            onChange={(event) => setGameId(event.target.value)}
            className="focus-ring mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          >
            <option value="">Best matching upcoming game</option>
            {filteredGames.map((game) => (
              <option key={game.id} value={game.id}>
                {formatGameLabel(game)}
              </option>
            ))}
          </select>
        </label>

        <LocationPicker
          value={location}
          onChange={setLocation}
          detecting={detectingLocation}
          onUseCurrentLocation={() => void detectCurrentLocation()}
          onSearchWithLocation={() => void search()}
          searchDisabled={loading || detectingLocation}
        />
        <VenueTypeSelector values={venueTypes} onChange={setVenueTypes} />
        <RadiusSelector value={radiusKm} onChange={setRadiusKm} />

        <button
          type="button"
          onClick={() => void search()}
          disabled={loading}
          className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-lg bg-action px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60 sm:w-fit"
        >
          <Search className="h-4 w-4" aria-hidden />
          {loading ? "Finding Venues" : "Find Venues"}
        </button>
      </section>

      {error ? <ErrorState message={error} /> : null}
      {saveMessage ? <p className="mb-4 rounded border border-action/30 bg-action/10 p-3 text-sm text-action">{saveMessage}</p> : null}

      {loading ? <LoadingState label="Ranking venues" /> : null}

      {!results && !loading ? (
        <EmptyState title="Ready to search" message="Choose a game, use current location or enter a city, pick a venue type, then find venues." />
      ) : null}

      {results ? (
        <div className="grid gap-6">
          <section>
            <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="section-heading">Games you can catch</h2>
                <p className="text-sm text-slate-600">A quick look at the matchups behind this search.</p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {results.games.map((game) => (
                <GameCard key={game.id} game={game} compact />
              ))}
            </div>
          </section>

          <GameDayExtras monetization={results.monetization} premium={user.isPremium} />

          <section>
            <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="section-heading">Places that fit</h2>
                <p className="text-sm text-slate-600">
                  Ranked by game fit, location, screens, fan signals, and the atmosphere you picked.
                </p>
              </div>
              <ResultsViewToggle value={viewMode} onChange={changeViewMode} mapAvailable={results.mapAvailable} />
            </div>
            {!results.mapAvailable ? (
              <p className="mb-3 rounded border border-amberline/30 bg-amberline/10 p-3 text-sm text-amber-900">
                Map view needs venue coordinates. Try current location or choose a supported city.
              </p>
            ) : null}
            <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
              <div>
                {viewMode === "map" ? (
                  <VenueMapView venues={results.venues} userLocation={userLocation} onSave={saveVenue} />
                ) : (
                  <VenueListView venues={results.venues} premium={user.isPremium} onSave={saveVenue} />
                )}
              </div>
              <AgentRecommendationSidebar cards={results.agentRecommendations} />
            </div>
          </section>

          <AssistantChatPanel
            userId={userId}
            context={{
              ...payload,
              topVenueId: results.venues[0]?.id
            }}
            onSuggestedFilters={applySuggestedFilters}
          />
        </div>
      ) : null}
    </>
  );
}
