import type { RankedVenue } from "../types/domain";
import { EmptyState } from "./EmptyState";
import { VenueCard } from "./VenueCard";

export function VenueListView({
  venues,
  premium,
  onSave
}: {
  venues: RankedVenue[];
  premium: boolean;
  onSave: (venueId: string) => void;
}) {
  if (venues.length === 0) {
    return (
      <EmptyState
        title="No venues yet"
        message="Try a supported city, expand the radius, or choose a broader venue type."
      />
    );
  }

  return (
    <div className="grid gap-4">
      {venues.map((venue) => (
        <VenueCard key={venue.id} venue={venue} premium={premium} onSave={onSave} />
      ))}
    </div>
  );
}
