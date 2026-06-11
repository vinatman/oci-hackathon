import { BookmarkPlus } from "lucide-react";
import type { RankedVenue } from "../types/domain";

export function VenuePreviewPopup({ venue, onSave }: { venue: RankedVenue; onSave: (venueId: string) => void }) {
  return (
    <div className="w-56 text-sm">
      <h3 className="font-semibold text-ink">{venue.name}</h3>
      <p className="mt-1 text-slate-600">{venue.venueType}</p>
      <p className="mt-1 text-slate-600">{venue.address}</p>
      <p className="mt-2 font-semibold text-action">{venue.confidencePercentage}% confidence</p>
      {venue.evidenceBadges.length ? (
        <p className="mt-1 text-xs text-slate-600">{venue.evidenceBadges.slice(0, 2).join(" · ")}</p>
      ) : null}
      <button
        type="button"
        onClick={() => onSave(venue.id)}
        className="mt-3 inline-flex items-center gap-2 rounded bg-ink px-3 py-2 text-xs font-semibold text-white"
      >
        <BookmarkPlus className="h-3.5 w-3.5" aria-hidden />
        Save
      </button>
    </div>
  );
}
