import { List, Map } from "lucide-react";
import type { ResultsViewMode } from "../utils/resultsViewMode";

export function ResultsViewToggle({
  value,
  onChange,
  mapAvailable
}: {
  value: ResultsViewMode;
  onChange: (value: ResultsViewMode) => void;
  mapAvailable: boolean;
}) {
  return (
    <div className="inline-flex rounded-lg border border-slate-300 bg-white p-1" aria-label="Results display mode">
      <button
        type="button"
        onClick={() => onChange("list")}
        className={[
          "focus-ring inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-semibold",
          value === "list" ? "bg-ink text-white" : "text-slate-600 hover:bg-field"
        ].join(" ")}
      >
        <List className="h-4 w-4" aria-hidden />
        List
      </button>
      <button
        type="button"
        disabled={!mapAvailable}
        onClick={() => onChange("map")}
        className={[
          "focus-ring inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-45",
          value === "map" ? "bg-ink text-white" : "text-slate-600 hover:bg-field"
        ].join(" ")}
      >
        <Map className="h-4 w-4" aria-hidden />
        Map
      </button>
    </div>
  );
}
