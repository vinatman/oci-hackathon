import { Plus, X } from "lucide-react";
import type { Team } from "../types/domain";

export function TeamCard({
  team,
  selected,
  onAdd,
  onRemove
}: {
  team: Team;
  selected?: boolean;
  onAdd?: (team: Team) => void;
  onRemove?: (team: Team) => void;
}) {
  return (
    <article className="flex min-h-[120px] flex-col justify-between rounded border border-slate-200 bg-white p-4 shadow-soft">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-action">{team.league}</p>
        <h3 className="mt-1 text-base font-semibold text-ink">{team.name}</h3>
        <p className="text-sm text-slate-600">
          {team.city}, {team.country}
        </p>
      </div>
      {selected ? (
        <button
          type="button"
          onClick={() => onRemove?.(team)}
          className="focus-ring mt-4 inline-flex items-center justify-center gap-2 rounded border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-field"
        >
          <X className="h-4 w-4" aria-hidden />
          Remove
        </button>
      ) : (
        <button
          type="button"
          onClick={() => onAdd?.(team)}
          className="focus-ring mt-4 inline-flex items-center justify-center gap-2 rounded bg-action px-3 py-2 text-sm font-semibold text-white"
        >
          <Plus className="h-4 w-4" aria-hidden />
          Add
        </button>
      )}
    </article>
  );
}
