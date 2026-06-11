import type { Team } from "../types/domain";

export function TeamSelector({
  teams,
  value,
  onChange
}: {
  teams: Team[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block text-sm font-medium text-ink">
      Team
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="focus-ring mt-1 w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm"
      >
        <option value="">Any team</option>
        {teams.map((team) => (
          <option key={team.id} value={team.id}>
            {team.name}
          </option>
        ))}
      </select>
    </label>
  );
}
