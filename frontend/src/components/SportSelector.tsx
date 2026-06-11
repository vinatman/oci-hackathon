import { SPORTS } from "../types/constants";

export function SportSelector({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <label className="block text-sm font-medium text-ink">
      Sport
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="focus-ring mt-1 w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm"
      >
        <option value="">Any sport</option>
        {SPORTS.map((sport) => (
          <option key={sport} value={sport}>
            {sport}
          </option>
        ))}
      </select>
    </label>
  );
}
