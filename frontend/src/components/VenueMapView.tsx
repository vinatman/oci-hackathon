import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import type { RankedVenue } from "../types/domain";
import { EmptyState } from "./EmptyState";
import { VenueMapMarker } from "./VenueMapMarker";

delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
});

export function VenueMapView({
  venues,
  userLocation,
  onSave
}: {
  venues: RankedVenue[];
  userLocation?: { latitude: number; longitude: number };
  onSave: (venueId: string) => void;
}) {
  const mapReadyVenues = venues.filter((venue) => Number.isFinite(venue.latitude) && Number.isFinite(venue.longitude));

  if (mapReadyVenues.length === 0) {
    return (
      <EmptyState
        title="Map view needs venue coordinates"
        message="Try current location or choose a supported city."
      />
    );
  }

  const firstVenue = mapReadyVenues[0];
  const center: [number, number] = userLocation
    ? [userLocation.latitude, userLocation.longitude]
    : [firstVenue.latitude, firstVenue.longitude];

  return (
    <div className="h-[520px] overflow-hidden rounded border border-slate-200 bg-white shadow-soft">
      <MapContainer center={center} zoom={12} scrollWheelZoom className="h-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {userLocation ? (
          <CircleMarker
            center={[userLocation.latitude, userLocation.longitude]}
            pathOptions={{ color: "#0f766e", fillColor: "#0f766e", fillOpacity: 0.7 }}
            radius={9}
          >
            <Popup>Current location</Popup>
          </CircleMarker>
        ) : null}
        {mapReadyVenues.map((venue) => (
          <VenueMapMarker key={venue.id} venue={venue} onSave={onSave} />
        ))}
      </MapContainer>
    </div>
  );
}
