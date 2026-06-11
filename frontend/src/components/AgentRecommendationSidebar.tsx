import { BadgeCheck, Lightbulb } from "lucide-react";
import type { AgentCard } from "../types/domain";

export function AgentRecommendationSidebar({ cards }: { cards: AgentCard[] }) {
  return (
    <aside className="rounded border border-slate-200 bg-white p-4 shadow-soft">
      <div className="mb-4 flex items-center gap-2">
        <Lightbulb className="h-5 w-5 text-action" aria-hidden />
        <h2 className="text-base font-semibold text-ink">Agent recommendations</h2>
      </div>
      <div className="grid gap-3">
        {cards.map((card, index) => (
          <article key={`${card.type}-${index}`} className="rounded border border-slate-200 bg-field p-3">
            <div className="flex gap-2">
              <BadgeCheck className="mt-0.5 h-4 w-4 flex-none text-action" aria-hidden />
              <div>
                <h3 className="text-sm font-semibold text-ink">{card.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{card.description}</p>
                {card.ctaLabel ? <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-action">{card.ctaLabel}</p> : null}
              </div>
            </div>
          </article>
        ))}
      </div>
    </aside>
  );
}
