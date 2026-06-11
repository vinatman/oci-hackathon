import { Heart, MapPinned, Star, UserCircle } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { PremiumBadge } from "../components/PremiumBadge";
import { useDemoUser } from "../hooks/useDemoUser";
import { FavoriteTeamsPanel } from "./FavoriteTeams";
import { ProfilePanel } from "./Profile";
import { SavedVenuesPanel } from "./SavedVenues";

type PreferenceSectionId = "profile" | "teams" | "saved";

const preferenceSections: Array<{
  id: PreferenceSectionId;
  label: string;
  description: string;
  icon: typeof UserCircle;
}> = [
  {
    id: "profile",
    label: "Profile",
    description: "Tune your travel mode, sports, leagues, and venue style.",
    icon: UserCircle
  },
  {
    id: "teams",
    label: "Favorite Teams",
    description: "Add the teams that should shape every venue recommendation.",
    icon: Star
  },
  {
    id: "saved",
    label: "Saved Watch Spots",
    description: "Keep trusted places for this trip and future game days.",
    icon: Heart
  }
];

function normalizeSection(value: string | null): PreferenceSectionId {
  if (value === "teams" || value === "saved" || value === "profile") {
    return value;
  }
  return "profile";
}

export function Preferences() {
  const { user } = useDemoUser();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSection = normalizeSection(searchParams.get("section"));

  if (!user) {
    return null;
  }

  const selectSection = (section: PreferenceSectionId) => {
    setSearchParams({ section });
  };

  return (
    <>
      <header className="mb-6 rounded-lg bg-ink p-5 text-white shadow-soft sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-200">Hey Traveling Fan!</p>
            <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">Preferences</h1>
            <p className="mt-3 text-sm leading-6 text-slate-200">
              Manage your fan profile, favorite teams, and saved watch spots so Sports Connect can recommend better places to
              catch the game wherever you land.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <PremiumBadge active={user.isPremium} />
            <button
              type="button"
              onClick={() => selectSection("teams")}
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-ink"
            >
              <Star className="h-4 w-4" aria-hidden />
              Add teams
            </button>
            <Link
              to="/venue-finder"
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg border border-white/30 px-4 py-2 text-sm font-semibold text-white"
            >
              <MapPinned className="h-4 w-4" aria-hidden />
              Find venues
            </Link>
          </div>
        </div>
      </header>

      <div className="mb-6 grid gap-3 md:grid-cols-3">
        {preferenceSections.map((section) => {
          const Icon = section.icon;
          const isActive = section.id === activeSection;
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => selectSection(section.id)}
              className={[
                "focus-ring rounded-lg border p-4 text-left shadow-soft transition",
                isActive ? "border-action bg-action/10" : "border-slate-200 bg-white hover:border-action/40 hover:bg-field"
              ].join(" ")}
              aria-pressed={isActive}
            >
              <span className="flex items-center gap-2 text-sm font-semibold text-ink">
                <Icon className={["h-4 w-4", isActive ? "text-action" : "text-slate-500"].join(" ")} aria-hidden />
                {section.label}
              </span>
              <span className="mt-2 block text-sm leading-5 text-slate-600">{section.description}</span>
            </button>
          );
        })}
      </div>

      <section aria-label="Preferences section" className="min-w-0">
        {activeSection === "profile" ? (
          <>
            <SectionIntro title="Fan profile" description="Set the defaults that pre-fill Venue Finder and shape your dashboard." />
            <ProfilePanel />
          </>
        ) : null}
        {activeSection === "teams" ? (
          <>
            <SectionIntro
              title="Favorite teams"
              description="Your teams make the recommendations team-aware instead of just showing generic nearby bars."
            />
            <FavoriteTeamsPanel showHeader={false} />
          </>
        ) : null}
        {activeSection === "saved" ? (
          <>
            <SectionIntro
              title="Saved watch spots"
              description="Review and remove the venues you have kept for future trips and game days."
            />
            <SavedVenuesPanel showHeader={false} />
          </>
        ) : null}
      </section>
    </>
  );
}

function SectionIntro({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold text-ink">{title}</h2>
      <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}
