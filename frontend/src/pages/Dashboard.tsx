import { useEffect, useState } from "react";
import { ArrowRight, MapPin, ShieldCheck, Star, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { AdvertisingWidget } from "../components/AdvertisingWidget";
import { AgentRecommendationSidebar } from "../components/AgentRecommendationSidebar";
import { BettingWidget } from "../components/BettingWidget";
import { GameCard } from "../components/GameCard";
import { LoadingState } from "../components/LoadingState";
import { PageHeader } from "../components/PageHeader";
import { PartnerPromotionWidget } from "../components/PartnerPromotionWidget";
import { PremiumBadge } from "../components/PremiumBadge";
import { TicketWidget } from "../components/TicketWidget";
import { VenueCard } from "../components/VenueCard";
import { useDemoUser } from "../hooks/useDemoUser";
import type { AgentCard, Game, RankedVenue, VenueSearchResponse } from "../types/domain";

export function Dashboard() {
  const { user, userId } = useDemoUser();
  const [games, setGames] = useState<Game[]>([]);
  const [venues, setVenues] = useState<RankedVenue[]>([]);
  const [recommendations, setRecommendations] = useState<AgentCard[]>([]);
  const [monetization, setMonetization] = useState<VenueSearchResponse["monetization"]>();
  const [saveMessage, setSaveMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId || !user) {
      return;
    }

    const load = async () => {
      setLoading(true);
      const profile = user.profile;
      const preferredSport = profile?.preferredSports?.[0];
      const preferredLeague = profile?.preferredLeagues?.[0];
      const matchingFavorite = user.favoriteTeams?.find(({ team }) => {
        if (preferredSport && team.sport !== preferredSport) return false;
        if (preferredLeague && team.league !== preferredLeague) return false;
        return true;
      })?.team;
      const favorite = matchingFavorite ?? (!preferredSport && !preferredLeague ? user.favoriteTeams?.[0]?.team : undefined);
      const search = await api.searchVenues(userId, {
        sport: preferredSport ?? favorite?.sport,
        league: preferredLeague ?? favorite?.league,
        teamId: favorite?.id,
        city: user.homeCity ?? "Los Angeles",
        venueTypes: profile?.preferredVenueTypes?.slice(0, 1) ?? ["Sports bar"],
        radiusKm: 40
      });
      setGames(search.games.slice(0, 4));
      setVenues(search.venues.slice(0, 3));
      setRecommendations(search.agentRecommendations);
      setMonetization(search.monetization);
      setLoading(false);
    };

    void load();
  }, [user, userId]);

  if (!user || !userId || loading || !monetization) {
    return <LoadingState label="Loading dashboard" />;
  }

  const favoriteTeams = user.favoriteTeams?.map((favorite) => favorite.team.name) ?? [];
  const preferredLeagues = user.profile?.preferredLeagues ?? [];
  const preferredVenueTypes = user.profile?.preferredVenueTypes ?? [];
  const saveVenue = async (venueId: string) => {
    await api.saveVenue(userId, venueId);
    setSaveMessage("Venue saved.");
  };

  return (
    <>
      <PageHeader title="Dashboard" eyebrow="Game-day overview">
        <PremiumBadge active={user.isPremium} />
      </PageHeader>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="grid gap-6">
          <section className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.9fr)]">
            <div className="rounded-lg bg-ink p-5 text-white shadow-soft sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-200">Current watch plan</p>
              <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">
                {user.homeCity ? `Ready for ${user.homeCity}` : "Ready for your next game"}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200">
                {favoriteTeams.length
                  ? `Tracking ${favoriteTeams.slice(0, 2).join(", ")}${favoriteTeams.length > 2 ? " and more" : ""}.`
                  : "Add favorite teams to tune game and venue recommendations."}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link
                  to="/venue-finder"
                  className="focus-ring inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-ink"
                >
                  Find venues
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <Link
                  to="/profile"
                  className="focus-ring inline-flex items-center rounded-lg border border-white/30 px-4 py-2 text-sm font-semibold text-white"
                >
                  Tune profile
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <SummaryTile icon={Trophy} label="Profile" value={user.displayName} detail={user.homeCity ?? "No home city"} />
              <SummaryTile
                icon={Star}
                label="Favorites"
                value={String(favoriteTeams.length)}
                detail={favoriteTeams.length ? favoriteTeams.slice(0, 2).join(", ") : "None yet"}
              />
              <SummaryTile
                icon={MapPin}
                label="Venue style"
                value={preferredVenueTypes[0] ?? "Any"}
                detail={preferredVenueTypes.slice(1, 3).join(", ") || "No extra filters"}
              />
              <SummaryTile
                icon={ShieldCheck}
                label="Leagues"
                value={preferredLeagues[0] ?? "Any"}
                detail={preferredLeagues.slice(1, 3).join(", ") || "Flexible"}
              />
            </div>
          </section>

          <section>
            <div className="mb-3">
              <h2 className="section-heading">Upcoming games</h2>
              <p className="text-sm text-slate-600">Matched to your profile preferences and favorite teams.</p>
            </div>
            {games.length ? (
              <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
                {games.map((game) => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            ) : (
              <p className="rounded border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-soft">
                No upcoming games match your current profile preferences.
              </p>
            )}
          </section>

          <section>
            <div className="mb-3">
              <h2 className="section-heading">Recommended venues</h2>
              <p className="text-sm text-slate-600">Ranked using your home city, preferred venue types, and favorite teams.</p>
            </div>
            {saveMessage ? (
              <p className="mb-3 rounded border border-action/30 bg-action/10 p-3 text-sm text-action">{saveMessage}</p>
            ) : null}
            {venues.length ? (
              <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
                {venues.map((venue) => (
                  <VenueCard key={venue.id} venue={venue} premium={user.isPremium} onSave={saveVenue} />
                ))}
              </div>
            ) : (
              <p className="rounded border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-soft">
                No venues match your current profile preferences. Try another home city or venue type.
              </p>
            )}
          </section>

          <section className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-4">
            <TicketWidget offers={monetization.tickets} />
            <BettingWidget widget={monetization.betting} />
            <AdvertisingWidget ads={monetization.ads} premium={user.isPremium} />
            <PartnerPromotionWidget offers={monetization.promotions} />
          </section>
        </div>

        <AgentRecommendationSidebar cards={recommendations} />
      </div>
    </>
  );
}

function SummaryTile({
  icon: Icon,
  label,
  value,
  detail
}: {
  icon: typeof Trophy;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <article className="app-card min-w-0 p-4">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-action/10 text-action">
        <Icon className="h-4 w-4" aria-hidden />
      </div>
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</p>
      <p className="mt-1 truncate text-base font-semibold text-ink">{value}</p>
      <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-600">{detail}</p>
    </article>
  );
}
