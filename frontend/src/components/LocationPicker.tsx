import { LocateFixed, MapPin, Search } from "lucide-react";
import { DEMO_CITIES } from "../types/constants";

export interface LocationState {
  mode: "current" | "manual";
  city: string;
  region?: string;
  country?: string;
  displayName?: string;
  latitude?: number;
  longitude?: number;
  locationSource?: "browser" | "manual" | "demo" | "profile";
  status: string;
  statusKind?: "idle" | "loading" | "success" | "error";
}

function roundedCoordinate(value: number) {
  return value.toFixed(4);
}

function hasDetectedCoordinates(value: LocationState) {
  return value.mode === "current" && typeof value.latitude === "number" && typeof value.longitude === "number";
}

function detectedLocationLabel(value: LocationState) {
  if (value.city && value.region) return `${value.city}, ${value.region}`;
  if (value.city) return value.city;
  if (hasDetectedCoordinates(value)) {
    return `${roundedCoordinate(value.latitude!)}, ${roundedCoordinate(value.longitude!)}`;
  }
  return "";
}

export function LocationPicker({
  value,
  onChange,
  detecting,
  onUseCurrentLocation,
  onSearchWithLocation,
  searchDisabled
}: {
  value: LocationState;
  onChange: (value: LocationState) => void;
  detecting?: boolean;
  onUseCurrentLocation: () => void;
  onSearchWithLocation?: () => void;
  searchDisabled?: boolean;
}) {
  const detected = hasDetectedCoordinates(value);
  const cityLabel = detectedLocationLabel(value);
  const statusTone =
    value.statusKind === "error"
      ? "border-coral/30 bg-coral/10 text-coral"
      : value.statusKind === "success"
        ? "border-action/30 bg-action/10 text-action"
        : "border-slate-200 bg-field text-slate-600";

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-ink">Location</p>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Use your actual browser location for nearby venue ranking. Demo cities are available as a fallback.
          </p>
        </div>
        <button
          type="button"
          onClick={onUseCurrentLocation}
          disabled={detecting}
          className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-lg bg-action px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60 sm:w-fit"
        >
          <LocateFixed className="h-4 w-4" aria-hidden />
          {detecting ? "Detecting..." : "Use Current Location"}
        </button>
      </div>

      <div className={["mt-4 rounded-lg border p-3 text-sm", statusTone].join(" ")}>
        <p className="font-semibold">
          {detecting ? "Detecting your location..." : detected ? "Location detected" : "Location status"}
        </p>
        <p className="mt-1">{value.status}</p>
        {detected ? (
          <div className="mt-3 grid gap-2 text-sm text-ink sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <p className="font-semibold">
                {value.city ? `Using your current location near ${cityLabel}.` : "Using your current coordinates."}
              </p>
              <p className="mt-1 text-slate-600">
                Coordinates: {roundedCoordinate(value.latitude!)}, {roundedCoordinate(value.longitude!)}
              </p>
            </div>
            {onSearchWithLocation ? (
              <button
                type="button"
                onClick={onSearchWithLocation}
                disabled={searchDisabled}
                className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg bg-ink px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Search className="h-4 w-4" aria-hidden />
                Search venues using this location
              </button>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.85fr)]">
        <label className="block text-sm font-medium text-ink">
          Can't use current location? Enter a city manually.
          <input
            value={value.mode === "manual" ? value.city : ""}
            onChange={(event) =>
              onChange({
                mode: "manual",
                city: event.target.value,
                latitude: undefined,
                longitude: undefined,
                locationSource: "manual",
                status: event.target.value ? "Manual city ready." : "Enter a city or use current location.",
                statusKind: "idle"
              })
            }
            placeholder="San Francisco"
            className="focus-ring mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          />
        </label>

        <div>
          <p className="text-sm font-semibold text-ink">Try a demo city</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {DEMO_CITIES.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() =>
                  onChange({
                    mode: "manual",
                    city,
                    latitude: undefined,
                    longitude: undefined,
                    locationSource: "demo",
                    status: `${city} selected as a demo city.`,
                    statusKind: "idle"
                  })
                }
                className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:border-action/40 hover:bg-action/10 hover:text-action"
              >
                <MapPin className="h-3.5 w-3.5" aria-hidden />
                {city}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
