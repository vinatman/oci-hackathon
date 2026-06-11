import { useEffect, useState } from "react";
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
          <section className="grid gap-4 md:grid-cols-3">
            <div className="rounded border border-slate-200 bg-white p-4 shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-action">Profile</p>
              <h2 className="mt-2 text-xl font-semibold text-ink">{user.displayName}</h2>
              <p className="mt-1 text-sm text-slate-600">{user.homeCity ?? "No home city set"}</p>
            </div>
            <div className="rounded border border-slate-200 bg-white p-4 shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-action">Favorite teams</p>
              <p className="mt-2 text-sm text-slate-700">{favoriteTeams.length ? favoriteTeams.join(", ") : "None yet"}</p>
            </div>
            <div className="rounded border border-slate-200 bg-white p-4 shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-action">Location</p>
              <p className="mt-2 text-sm text-slate-700">Using {user.homeCity ?? "your selected city"} until current location is allowed.</p>
            </div>
          </section>

          <section>
            <div className="mb-3">
              <h2 className="text-lg font-semibold text-ink">Upcoming games</h2>
              <p className="text-sm text-slate-600">Matched to your profile preferences and favorite teams.</p>
            </div>
            {games.length ? (
              <div className="grid gap-4 md:grid-cols-2">
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
              <h2 className="text-lg font-semibold text-ink">Recommended venues</h2>
              <p className="text-sm text-slate-600">Ranked using your home city, preferred venue types, and favorite teams.</p>
            </div>
            {saveMessage ? (
              <p className="mb-3 rounded border border-action/30 bg-action/10 p-3 text-sm text-action">{saveMessage}</p>
            ) : null}
            {venues.length ? (
              <div className="grid gap-4 lg:grid-cols-3">
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

          <section className="grid gap-4 lg:grid-cols-3">
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
