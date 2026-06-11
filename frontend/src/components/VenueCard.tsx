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
    <article className="app-card p-4 transition hover:-translate-y-0.5 hover:border-action/30">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold leading-6 text-ink sm:text-lg">{venue.name}</h3>
            {!premium && venue.isSponsored ? (
              <span className="rounded bg-amberline/15 px-2 py-0.5 text-xs font-semibold text-amber-800">
                Sponsored pick
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-slate-600">
            {venue.venueType} · {venue.address}, {venue.city}, {venue.state}
          </p>
        </div>
        <div className="w-fit rounded-lg bg-action/10 px-3 py-2 text-center">
          <p className="text-lg font-semibold text-action">{venue.confidencePercentage}%</p>
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">confidence</p>
        </div>
      </div>

      {venue.evidenceBadges.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {venue.evidenceBadges.slice(0, 6).map((badge) => (
            <span key={badge} className="rounded-lg bg-action/10 px-2.5 py-1 text-xs font-semibold text-action">
              {badge}
            </span>
          ))}
        </div>
      ) : null}

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

      <details className="mt-3 rounded-lg border border-slate-200 bg-field p-3">
        <summary className="cursor-pointer text-sm font-semibold text-ink">Why this match?</summary>
        <div className="mt-3 grid gap-2">
          {venue.matchedSignals.length ? (
            venue.matchedSignals
              .filter((signal) => signal.key !== "sponsored-capped")
              .map((signal) => (
                <div key={`${venue.id}-${signal.key}`} className="rounded-lg bg-white p-3 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-ink">{signal.label}</p>
                    <p className="text-xs font-semibold text-action">+{Math.round(signal.weight * 100)}</p>
                  </div>
                  <p className="mt-1 text-slate-600">{signal.detail}</p>
                </div>
              ))
          ) : (
            <p className="text-sm text-slate-600">This venue has limited team-specific evidence, so its score stays conservative.</p>
          )}
        </div>
      </details>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onSave(venue.id)}
          className="focus-ring inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-ink px-3 py-2 text-sm font-semibold text-white sm:flex-none"
        >
          <BookmarkPlus className="h-4 w-4" aria-hidden />
          Save
        </button>
        {venue.websiteUrl ? (
          <a
            href={venue.websiteUrl}
            target="_blank"
            rel="noreferrer"
            className="focus-ring inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 sm:flex-none"
          >
            <ExternalLink className="h-4 w-4" aria-hidden />
            Website
          </a>
        ) : null}
        {!premium && venue.monetizationCta ? (
          <span className="inline-flex w-full items-center justify-center rounded-lg border border-amberline/40 bg-amberline/10 px-3 py-2 text-sm font-semibold text-amber-800 sm:w-auto">
            Game-day table option
          </span>
        ) : null}
      </div>
    </article>
  );
}
