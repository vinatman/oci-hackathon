import { LEAGUES } from "../types/constants";

export function LeagueSelector({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <label className="block text-sm font-medium text-ink">
      League
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="focus-ring mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
      >
        <option value="">Any league</option>
        {LEAGUES.map((league) => (
          <option key={league} value={league}>
            {league}
          </option>
        ))}
      </select>
    </label>
  );
}
