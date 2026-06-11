import { CalendarDays } from "lucide-react";
import type { Game } from "../types/domain";
import { formatDateTime, formatGameLabel } from "../utils/format";

export function GameCard({ game, compact = false }: { game: Game; compact?: boolean }) {
  return (
    <article className="app-card p-4 transition hover:-translate-y-0.5 hover:border-action/30">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-action">{game.league}</p>
          <h3 className="mt-1 text-sm font-semibold leading-5 text-ink">{formatGameLabel(game)}</h3>
        </div>
        <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-field text-slate-500">
          <CalendarDays className="h-4 w-4" aria-hidden />
        </span>
      </div>
      <p className="mt-3 text-sm text-slate-600">{formatDateTime(game.startTime)}</p>
      {!compact && game.broadcastInfo ? <p className="mt-2 text-xs text-slate-500">{game.broadcastInfo}</p> : null}
    </article>
  );
}
