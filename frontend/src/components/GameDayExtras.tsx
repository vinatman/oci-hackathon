import { Car, ShieldAlert, ShoppingBag, Sparkles, Ticket, Utensils } from "lucide-react";
import type { VenueSearchResponse } from "../types/domain";

export function GameDayExtras({
  monetization,
  premium
}: {
  monetization: VenueSearchResponse["monetization"];
  premium: boolean;
}) {
  const ticket = monetization.tickets[0];
  const paidPick = !premium ? monetization.ads[0] : undefined;
  const offers = monetization.promotions.slice(0, paidPick ? 2 : 3);
  const showBetting = import.meta.env.VITE_ENABLE_BETTING_WIDGET === "true" && monetization.betting.enabled;

  if (!ticket && !paidPick && offers.length === 0 && !showBetting && !premium) {
    return null;
  }

  return (
    <section className="app-card overflow-hidden p-0">
      <div className="border-b border-slate-200 bg-white p-4 sm:flex sm:items-start sm:justify-between sm:gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-action">Game-day extras</p>
          <h2 className="mt-1 text-lg font-semibold text-ink">Make the night easy</h2>
          <p className="mt-1 text-sm text-slate-600">
            Helpful add-ons for getting there, grabbing food, or going to the game instead.
          </p>
        </div>
        {premium ? (
          <p className="mt-3 rounded-lg bg-amberline/10 px-3 py-2 text-sm font-medium text-amber-900 sm:mt-0">
            Premium is on, so paid placements stay out of your plans.
          </p>
        ) : null}
      </div>

      <div className="divide-y divide-slate-200">
        {ticket ? (
          <a href={ticket.targetUrl ?? "#"} className="focus-ring flex gap-3 p-4 transition hover:bg-field">
            <span className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-action/10 text-action">
              <Ticket className="h-5 w-5" aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-ink">Thinking about being there?</span>
              <span className="mt-1 block text-sm text-slate-600">{ticket.description}</span>
              <span className="mt-2 inline-block text-sm font-semibold text-action">{ticket.ctaLabel}</span>
            </span>
          </a>
        ) : null}

        {paidPick ? (
          <a href={paidPick.targetUrl ?? "#"} className="focus-ring flex gap-3 p-4 transition hover:bg-field">
            <span className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-amberline/15 text-amber-800">
              <Sparkles className="h-5 w-5" aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-amber-800">Sponsored pick</span>
              <span className="mt-1 block text-sm font-semibold text-ink">{paidPick.title}</span>
              <span className="mt-1 block text-sm text-slate-600">{paidPick.description}</span>
            </span>
          </a>
        ) : null}

        {offers.map((offer) => (
          <a key={offer.id} href={offer.targetUrl ?? "#"} className="focus-ring flex gap-3 p-4 transition hover:bg-field">
            <span className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-slate-100 text-slate-700">
              <OfferIcon partnerType={offer.partnerType} />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-ink">{offer.title}</span>
              <span className="mt-1 block text-sm text-slate-600">{offer.description}</span>
              <span className="mt-2 inline-block text-sm font-semibold text-action">{offer.ctaLabel}</span>
            </span>
          </a>
        ))}

        {showBetting ? (
          <div className="flex gap-3 p-4">
            <span className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-coral/10 text-coral">
              <ShieldAlert className="h-5 w-5" aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-ink">Responsible gaming information</span>
              <span className="mt-1 block text-sm text-slate-600">{monetization.betting.description}</span>
              <span className="mt-2 block text-xs text-slate-500">{monetization.betting.disclaimer}</span>
            </span>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function OfferIcon({ partnerType }: { partnerType: string }) {
  if (partnerType === "food") return <Utensils className="h-5 w-5" aria-hidden />;
  if (partnerType === "rideshare") return <Car className="h-5 w-5" aria-hidden />;
  return <ShoppingBag className="h-5 w-5" aria-hidden />;
}
