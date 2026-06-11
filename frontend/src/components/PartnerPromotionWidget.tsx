import { Handshake } from "lucide-react";
import type { PartnerOffer } from "../types/domain";

export function PartnerPromotionWidget({ offers }: { offers: PartnerOffer[] }) {
  if (offers.length === 0) {
    return null;
  }

  return (
    <section className="app-card p-4">
      <div className="flex items-center gap-2">
        <Handshake className="h-5 w-5 text-action" aria-hidden />
        <h2 className="text-base font-semibold text-ink">Partner Promotions</h2>
      </div>
      <div className="mt-3 grid gap-3">
        {offers.slice(0, 3).map((offer) => (
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
