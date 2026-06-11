import { Ticket } from "lucide-react";
import type { TicketOffer } from "../types/domain";

export function TicketWidget({ offers }: { offers: TicketOffer[] }) {
  if (import.meta.env.VITE_ENABLE_TICKETS_WIDGET === "false" || offers.length === 0) {
    return null;
  }

  return (
    <section className="app-card p-4">
      <div className="flex items-center gap-2">
        <Ticket className="h-5 w-5 text-action" aria-hidden />
        <h2 className="text-base font-semibold text-ink">Find Tickets</h2>
      </div>
      <div className="mt-3 grid gap-3">
        {offers.map((offer) => (
          <a
            key={offer.id}
            href={offer.targetUrl ?? "#"}
            className="focus-ring rounded-lg border border-slate-200 bg-field p-3 text-sm transition hover:border-action/30 hover:bg-white"
          >
            <strong className="block text-ink">{offer.title}</strong>
            <span className="mt-1 block text-slate-600">{offer.description}</span>
            <span className="mt-2 inline-block font-semibold text-action">{offer.ctaLabel}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
