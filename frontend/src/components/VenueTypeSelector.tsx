import { VENUE_TYPES } from "../types/constants";

export function VenueTypeSelector({ values, onChange }: { values: string[]; onChange: (values: string[]) => void }) {
  const toggle = (venueType: string) => {
    onChange(values.includes(venueType) ? values.filter((value) => value !== venueType) : [...values, venueType]);
  };

  return (
    <fieldset>
      <legend className="text-sm font-medium text-ink">Venue types</legend>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {VENUE_TYPES.map((venueType) => (
          <label key={venueType} className="flex items-center gap-2 rounded border border-slate-200 bg-white px-3 py-2 text-sm">
            <input
              type="checkbox"
              checked={values.includes(venueType)}
              onChange={() => toggle(venueType)}
              className="h-4 w-4 rounded border-slate-300 text-action focus:ring-action"
            />
            {venueType}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
