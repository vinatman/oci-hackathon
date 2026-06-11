import { LocateFixed } from "lucide-react";
import { DEMO_CITIES } from "../types/constants";

interface LocationState {
  mode: "current" | "manual";
  city: string;
  latitude?: number;
  longitude?: number;
  status: string;
}

export function LocationPicker({
  value,
  onChange
}: {
  value: LocationState;
  onChange: (value: LocationState) => void;
}) {
  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      onChange({ ...value, mode: "manual", status: "Geolocation is not available in this browser." });
      return;
    }

    onChange({ ...value, mode: "current", status: "Requesting current location..." });
    navigator.geolocation.getCurrentPosition(
      (position) => {
        onChange({
          ...value,
          mode: "current",
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          status: "Current location ready."
        });
      },
      () => {
        onChange({
          ...value,
          mode: "manual",
          status: "Location permission was not granted. Choose a supported city."
        });
      },
      { enableHighAccuracy: false, timeout: 6000 }
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={useCurrentLocation}
          className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-lg bg-action px-3 py-2 text-sm font-semibold text-white sm:w-auto"
        >
          <LocateFixed className="h-4 w-4" aria-hidden />
          Current location
        </button>
        <select
          value={value.city}
          onChange={(event) =>
            onChange({
              mode: "manual",
              city: event.target.value,
              status: event.target.value
                ? "Selected city ready."
                : "Choose current location or a supported city.",
              latitude: undefined,
              longitude: undefined
            })
          }
          className="focus-ring min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm sm:min-w-[220px]"
        >
          <option value="">Manual city</option>
          {DEMO_CITIES.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>
      <p className="text-xs text-slate-500">{value.status}</p>
    </div>
  );
}
