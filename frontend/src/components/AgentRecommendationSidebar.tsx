import { BadgeCheck, Lightbulb } from "lucide-react";
import type { AgentCard } from "../types/domain";

export function AgentRecommendationSidebar({ cards }: { cards: AgentCard[] }) {
  return (
    <aside className="app-card p-4 xl:sticky xl:top-6 xl:self-start">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-action/10 text-action">
          <Lightbulb className="h-4 w-4" aria-hidden />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-action">Smart picks</p>
          <h2 className="text-base font-semibold text-ink">A few ideas for you</h2>
        </div>
      </div>
      <div className="grid gap-3">
        {cards.map((card, index) => (
          <article key={`${card.type}-${index}`} className="rounded-lg border border-slate-200 bg-field p-3">
            <div className="flex gap-2">
              <BadgeCheck className="mt-0.5 h-4 w-4 flex-none text-action" aria-hidden />
              <div>
                <h3 className="text-sm font-semibold text-ink">{friendlyTitle(card)}</h3>
                <p className="mt-1 text-sm text-slate-600">{card.description}</p>
                {card.type === "sponsored" ? (
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-amber-800">Sponsored pick</p>
                ) : card.ctaLabel ? (
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-action">{friendlyCta(card)}</p>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </div>
    </aside>
  );
}

function friendlyTitle(card: AgentCard) {
  if (card.type === "best-venue") return "Start here";
  if (card.type === "best-game") return "Game to build around";
  if (card.type === "team-friendly") return "Fan-friendly choice";
  if (card.type === "ticket") return "Want to go instead?";
  if (card.type === "sponsored") return "Worth knowing";
  if (card.type === "promotion") return "Nearby bonus";
  if (card.type === "try-search") return "Try another angle";
  return card.title;
}

function friendlyCta(card: AgentCard) {
  if (card.type === "best-venue") return "View spot";
  if (card.type === "best-game") return "Use this game";
  if (card.type === "team-friendly") return "Save for later";
  return card.ctaLabel;
}
