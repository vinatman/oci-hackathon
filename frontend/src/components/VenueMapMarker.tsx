import { Marker, Popup } from "react-leaflet";
import type { RankedVenue } from "../types/domain";
import { VenuePreviewPopup } from "./VenuePreviewPopup";

export function VenueMapMarker({ venue, onSave }: { venue: RankedVenue; onSave: (venueId: string) => void }) {
  return (
    <Marker position={[venue.latitude, venue.longitude]}>
      <Popup>
        <VenuePreviewPopup venue={venue} onSave={onSave} />
      </Popup>
    </Marker>
  );
}
