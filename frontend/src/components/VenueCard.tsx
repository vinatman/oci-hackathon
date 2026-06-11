import { BookmarkPlus, ExternalLink } from "lucide-react";
import type { RankedVenue } from "../types/domain";
import { formatDateTime, formatDistance } from "../utils/format";

export function VenueCard({
  venue,
  premium,
  onSave
}: {
  venue: RankedVenue;
  premium?: boolean;
  onSave: (venueId: string) => void;
}) {
  return (
    <article className="rounded border border-slate-200 bg-white p-4 shadow-soft">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-ink">{venue.name}</h3>
            {!premium && venue.isSponsored ? (
              <span className="rounded bg-amberline/15 px-2 py-0.5 text-xs font-semibold text-amber-800">Sponsored</span>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-slate-600">
            {venue.venueType} · {venue.address}, {venue.city}, {venue.state}
          </p>
        </div>
        <div className="rounded bg-action/10 px-3 py-2 text-center">
          <p className="text-lg font-semibold text-action">{Math.round(venue.confidenceScore * 100)}%</p>
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">confidence</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
        <p>{formatDistance(venue.distanceKm)}</p>
        {venue.relevantGame ? (
          <p>
            {venue.relevantGame.label} · {formatDateTime(venue.relevantGame.startTime)}
          </p>
        ) : (
          <p>Relevant game unavailable</p>
        )}
      </div>

      <p className="mt-3 text-sm text-slate-700">{venue.evidenceText}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onSave(venue.id)}
          className="focus-ring inline-flex items-center gap-2 rounded bg-ink px-3 py-2 text-sm font-semibold text-white"
        >
          <BookmarkPlus className="h-4 w-4" aria-hidden />
          Save
        </button>
        {venue.websiteUrl ? (
          <a
            href={venue.websiteUrl}
            target="_blank"
            rel="noreferrer"
            className="focus-ring inline-flex items-center gap-2 rounded border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700"
          >
            <ExternalLink className="h-4 w-4" aria-hidden />
            Website
          </a>
        ) : null}
        {!premium && venue.monetizationCta ? (
          <span className="inline-flex items-center rounded border border-amberline/40 bg-amberline/10 px-3 py-2 text-sm font-semibold text-amber-800">
            {venue.monetizationCta.label}
          </span>
        ) : null}
      </div>
    </article>
  );
}
