import { CalendarDays } from "lucide-react";
import type { Game } from "../types/domain";
import { formatDateTime, formatGameLabel } from "../utils/format";

export function GameCard({ game, compact = false }: { game: Game; compact?: boolean }) {
  return (
    <article className="rounded border border-slate-200 bg-white p-4 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-action">{game.league}</p>
          <h3 className="mt-1 text-sm font-semibold text-ink">{formatGameLabel(game)}</h3>
        </div>
        <CalendarDays className="h-5 w-5 text-slate-400" aria-hidden />
      </div>
      <p className="mt-3 text-sm text-slate-600">{formatDateTime(game.startTime)}</p>
      {!compact && game.broadcastInfo ? <p className="mt-2 text-xs text-slate-500">{game.broadcastInfo}</p> : null}
    </article>
  );
}
