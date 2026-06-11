export function RadiusSelector({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return (
    <label className="block text-sm font-medium text-ink">
      Radius
      <div className="mt-1 flex items-center gap-3 rounded border border-slate-300 bg-white px-3 py-2">
        <input
          type="range"
          min="5"
          max="100"
          step="5"
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="w-full accent-action"
        />
        <span className="w-14 text-right text-sm text-slate-700">{value} km</span>
      </div>
    </label>
  );
}
