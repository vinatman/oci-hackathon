import { useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import { LeagueSelector } from "../components/LeagueSelector";
import { LoadingState } from "../components/LoadingState";
import { PageHeader } from "../components/PageHeader";
import { SportSelector } from "../components/SportSelector";
import { TeamCard } from "../components/TeamCard";
import { useDemoUser } from "../hooks/useDemoUser";
import type { FavoriteTeam, Team } from "../types/domain";

export function FavoriteTeamsPanel({ showHeader = true }: { showHeader?: boolean }) {
  const { userId, refreshUser } = useDemoUser();
  const [teams, setTeams] = useState<Team[]>([]);
  const [favorites, setFavorites] = useState<FavoriteTeam[]>([]);
  const [sport, setSport] = useState("");
  const [league, setLeague] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!userId) {
      return;
    }
    setLoading(true);
    const [teamResponse, favoriteResponse] = await Promise.all([
      api.getTeams({ sport, league, q: query }),
      api.getFavoriteTeams(userId)
    ]);
    setTeams(teamResponse.teams);
    setFavorites(favoriteResponse.favoriteTeams);
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, [userId, sport, league, query]);

  const favoriteIds = useMemo(() => new Set(favorites.map((favorite) => favorite.teamId)), [favorites]);
  const selectedTeams = favorites.map((favorite) => favorite.team);

  const add = async (team: Team) => {
    if (!userId) return;
    await api.addFavoriteTeam(userId, team.id);
    await Promise.all([load(), refreshUser()]);
  };

  const remove = async (team: Team) => {
    if (!userId) return;
    await api.removeFavoriteTeam(userId, team.id);
    await Promise.all([load(), refreshUser()]);
  };

  return (
    <>
      {showHeader ? <PageHeader title="Teams you follow" eyebrow="Personalize the picks" /> : null}
      <section className="mb-6 grid gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-soft md:grid-cols-3">
        <SportSelector value={sport} onChange={setSport} />
        <LeagueSelector value={league} onChange={setLeague} />
        <label className="block text-sm font-medium text-ink">
          Search
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Lakers, Cowboys, Seattle"
            className="focus-ring mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-ink">Your teams</h2>
        {selectedTeams.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {selectedTeams.map((team) => (
              <TeamCard key={team.id} team={team} selected onRemove={remove} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 shadow-soft">
            <h3 className="text-sm font-semibold text-ink">No favorite teams yet</h3>
            <p className="mt-2 max-w-xl text-sm text-slate-600">
              No favorite teams yet. Add teams to get better venue recommendations.
            </p>
            <button
              type="button"
              onClick={() => document.getElementById("teams-to-add")?.scrollIntoView({ behavior: "smooth", block: "start" })}
              className="focus-ring mt-4 inline-flex items-center justify-center rounded-lg bg-action px-4 py-2 text-sm font-semibold text-white"
            >
              Add teams
            </button>
          </div>
        )}
      </section>

      <section id="teams-to-add">
        <h2 className="mb-3 text-lg font-semibold text-ink">Teams to add</h2>
        {loading ? (
          <LoadingState label="Loading teams" />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {teams.map((team) => (
              <TeamCard key={team.id} team={team} selected={favoriteIds.has(team.id)} onAdd={add} onRemove={remove} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export function FavoriteTeams() {
  return <FavoriteTeamsPanel />;
}
