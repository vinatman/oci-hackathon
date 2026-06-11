import { ShieldAlert } from "lucide-react";
import type { BettingWidgetData } from "../types/domain";

export function BettingWidget({ widget }: { widget?: BettingWidgetData }) {
  if (import.meta.env.VITE_ENABLE_BETTING_WIDGET !== "true" || !widget?.enabled) {
    return null;
  }

  return (
    <section className="app-card p-4">
      <div className="flex items-center gap-2">
        <ShieldAlert className="h-5 w-5 text-coral" aria-hidden />
        <h2 className="text-base font-semibold text-ink">Responsible gaming information</h2>
      </div>
      <p className="mt-2 text-sm text-slate-600">{widget.description}</p>
      <p className="mt-3 rounded-lg bg-coral/10 p-3 text-xs text-slate-700">{widget.disclaimer}</p>
    </section>
  );
}
