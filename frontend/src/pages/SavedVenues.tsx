import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../api/client";
import { EmptyState } from "../components/EmptyState";
import { LoadingState } from "../components/LoadingState";
import { PageHeader } from "../components/PageHeader";
import { useDemoUser } from "../hooks/useDemoUser";
import type { SavedVenue } from "../types/domain";

export function SavedVenues() {
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
      <PageHeader title="Saved Venues" eyebrow="Watch list" />
      {loading ? (
        <LoadingState label="Loading saved venues" />
      ) : savedVenues.length === 0 ? (
        <EmptyState title="No saved venues" message="Save a venue from Venue Finder to keep it here." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {savedVenues.map((saved) => (
            <article key={saved.id} className="rounded border border-slate-200 bg-white p-4 shadow-soft">
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
                  placeholder="Optional notes can be added through the save API."
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
