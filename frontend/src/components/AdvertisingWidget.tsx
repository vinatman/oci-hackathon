import { Megaphone } from "lucide-react";
import type { AdPlacement } from "../types/domain";

export function AdvertisingWidget({ ads, premium }: { ads: AdPlacement[]; premium: boolean }) {
  if (premium) {
    return (
      <section className="rounded border border-amberline/30 bg-amberline/10 p-4 text-sm text-amber-900">
        Premium active: advertising placements are hidden.
      </section>
    );
  }

  if (import.meta.env.VITE_ENABLE_AD_WIDGET === "false" || ads.length === 0) {
    return null;
  }

  return (
    <section className="rounded border border-slate-200 bg-white p-4 shadow-soft">
      <div className="flex items-center gap-2">
        <Megaphone className="h-5 w-5 text-amberline" aria-hidden />
        <h2 className="text-base font-semibold text-ink">Advertising</h2>
      </div>
      <div className="mt-3 grid gap-3">
        {ads.slice(0, 2).map((ad) => (
          <a
            key={ad.id}
            href={ad.targetUrl ?? "#"}
            className="focus-ring rounded border border-amberline/30 bg-amberline/10 p-3 text-sm"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-amber-800">Sponsored</span>
            <strong className="mt-1 block text-ink">{ad.title}</strong>
            <span className="mt-1 block text-slate-700">{ad.description}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
