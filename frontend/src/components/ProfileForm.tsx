import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { LEAGUES, SPORTS, VENUE_TYPES } from "../types/constants";
import type { User } from "../types/domain";

export interface ProfileFormValue {
  displayName: string;
  homeCity: string;
  isPremium: boolean;
  preferredSports: string[];
  preferredLeagues: string[];
  preferredVenueTypes: string[];
  travelModeEnabled: boolean;
}

function toggleValue(values: string[], value: string) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

export function ProfileForm({
  user,
  onSubmit,
  saving
}: {
  user: User;
  onSubmit: (value: ProfileFormValue) => Promise<void>;
  saving?: boolean;
}) {
  const [form, setForm] = useState<ProfileFormValue>({
    displayName: user.displayName,
    homeCity: user.homeCity ?? "",
    isPremium: user.isPremium,
    preferredSports: user.profile?.preferredSports ?? [],
    preferredLeagues: user.profile?.preferredLeagues ?? [],
    preferredVenueTypes: user.profile?.preferredVenueTypes ?? [],
    travelModeEnabled: user.profile?.travelModeEnabled ?? true
  });

  useEffect(() => {
    setForm({
      displayName: user.displayName,
      homeCity: user.homeCity ?? "",
      isPremium: user.isPremium,
      preferredSports: user.profile?.preferredSports ?? [],
      preferredLeagues: user.profile?.preferredLeagues ?? [],
      preferredVenueTypes: user.profile?.preferredVenueTypes ?? [],
      travelModeEnabled: user.profile?.travelModeEnabled ?? true
    });
  }, [user]);

  return (
    <form
      className="grid gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        void onSubmit(form);
      }}
    >
      <div className="grid gap-4 rounded border border-slate-200 bg-white p-4 shadow-soft md:grid-cols-2">
        <label className="block text-sm font-medium text-ink">
          Display name
          <input
            value={form.displayName}
            onChange={(event) => setForm({ ...form, displayName: event.target.value })}
            className="focus-ring mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm font-medium text-ink">
          Home city
          <input
            value={form.homeCity}
            onChange={(event) => setForm({ ...form, homeCity: event.target.value })}
            className="focus-ring mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="flex items-center gap-3 rounded border border-slate-200 bg-field px-3 py-3 text-sm font-medium text-ink">
          <input
            type="checkbox"
            checked={form.travelModeEnabled}
            onChange={(event) => setForm({ ...form, travelModeEnabled: event.target.checked })}
            className="h-4 w-4 rounded border-slate-300 text-action focus:ring-action"
          />
          Travel mode enabled
        </label>
        <label className="flex items-center gap-3 rounded border border-amberline/30 bg-amberline/10 px-3 py-3 text-sm font-medium text-amber-900">
          <input
            type="checkbox"
            checked={form.isPremium}
            onChange={(event) => setForm({ ...form, isPremium: event.target.checked })}
            className="h-4 w-4 rounded border-slate-300 text-amberline focus:ring-amberline"
          />
          Premium ad-free experience
        </label>
      </div>

      <PreferenceGroup
        title="Preferred sports"
        values={SPORTS}
        selected={form.preferredSports}
        onToggle={(value) => setForm({ ...form, preferredSports: toggleValue(form.preferredSports, value) })}
      />
      <PreferenceGroup
        title="Preferred leagues"
        values={LEAGUES}
        selected={form.preferredLeagues}
        onToggle={(value) => setForm({ ...form, preferredLeagues: toggleValue(form.preferredLeagues, value) })}
      />
      <PreferenceGroup
        title="Preferred venue types"
        values={VENUE_TYPES}
        selected={form.preferredVenueTypes}
        onToggle={(value) => setForm({ ...form, preferredVenueTypes: toggleValue(form.preferredVenueTypes, value) })}
      />

      <button
        type="submit"
        disabled={saving}
        className="focus-ring inline-flex w-fit items-center gap-2 rounded bg-action px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Save className="h-4 w-4" aria-hidden />
        {saving ? "Saving" : "Save profile"}
      </button>
    </form>
  );
}

function PreferenceGroup({
  title,
  values,
  selected,
  onToggle
}: {
  title: string;
  values: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <fieldset className="rounded border border-slate-200 bg-white p-4 shadow-soft">
      <legend className="px-1 text-sm font-semibold text-ink">{title}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {values.map((value) => (
          <label
            key={value}
            className={[
              "flex items-center gap-2 rounded border px-3 py-2 text-sm",
              selected.includes(value) ? "border-action bg-action/10 text-ink" : "border-slate-200 bg-field text-slate-700"
            ].join(" ")}
          >
            <input
              type="checkbox"
              checked={selected.includes(value)}
              onChange={() => onToggle(value)}
              className="h-4 w-4 rounded border-slate-300 text-action focus:ring-action"
            />
            {value}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
