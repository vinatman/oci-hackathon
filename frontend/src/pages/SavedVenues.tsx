import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { LoadingState } from "../components/LoadingState";
import { PageHeader } from "../components/PageHeader";
import { useDemoUser } from "../hooks/useDemoUser";
import type { SavedVenue } from "../types/domain";

export function SavedVenuesPanel({ showHeader = true }: { showHeader?: boolean }) {
  const { userId } = useDemoUser();
  const [savedVenues, setSavedVenues] = useState<SavedVenue[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!userId) return;
    setLoading(true);
    const response = await api.getSavedVenues(userId);
    setSavedVenues(response.savedVenues);
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, [userId]);

  const remove = async (venueId: string) => {
    if (!userId) return;
    await api.removeSavedVenue(userId, venueId);
    await load();
  };

  return (
    <>
      {showHeader ? <PageHeader title="Saved Watch Spots" eyebrow="Your watch list" /> : null}
      {loading ? (
        <LoadingState label="Loading saved spots" />
      ) : savedVenues.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 shadow-soft">
          <h3 className="text-sm font-semibold text-ink">No saved watch spots yet</h3>
          <p className="mt-2 max-w-xl text-sm text-slate-600">
            No saved watch spots yet. Save venues from Venue Finder to build your personal game-day map.
          </p>
          <Link
            to="/venue-finder"
            className="focus-ring mt-4 inline-flex items-center justify-center rounded-lg bg-action px-4 py-2 text-sm font-semibold text-white"
          >
            Find venues
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {savedVenues.map((saved) => (
            <article key={saved.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-action">{saved.venue.venueType}</p>
              <h2 className="mt-1 text-lg font-semibold text-ink">{saved.venue.name}</h2>
              <p className="mt-2 text-sm text-slate-600">
                {saved.venue.address}, {saved.venue.city}, {saved.venue.state}
              </p>
              <label className="mt-4 block text-sm font-medium text-ink">
                Notes
                <textarea
                  readOnly
                  value={saved.notes ?? ""}
                  placeholder="Add notes here in a future version."
                  className="mt-1 min-h-[82px] w-full rounded border border-slate-300 bg-field px-3 py-2 text-sm text-slate-600"
                />
              </label>
              <button
                type="button"
                onClick={() => void remove(saved.venueId)}
                className="focus-ring mt-4 inline-flex items-center gap-2 rounded border border-coral/40 px-3 py-2 text-sm font-semibold text-coral hover:bg-coral/10"
              >
                <Trash2 className="h-4 w-4" aria-hidden />
                Remove
              </button>
            </article>
          ))}
        </div>
      )}
    </>
  );
}

export function SavedVenues() {
  return <SavedVenuesPanel />;
}
