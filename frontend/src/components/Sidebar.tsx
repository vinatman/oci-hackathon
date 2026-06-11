import { Bot, Heart, Home, MapPinned, Star, UserCircle } from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Home", mobileLabel: "Home", icon: Home, end: true },
  { to: "/profile", label: "Preferences", mobileLabel: "Prefs", icon: UserCircle, end: false },
  { to: "/favorite-teams", label: "Teams", mobileLabel: "Teams", icon: Star, end: false },
  { to: "/venue-finder", label: "Find a Spot", mobileLabel: "Find", icon: MapPinned, end: false },
  { to: "/saved-venues", label: "Saved Spots", mobileLabel: "Saved", icon: Heart, end: false },
  { to: "/assistant", label: "Assistant", mobileLabel: "Assistant", icon: Bot, end: false }
];

export function Sidebar() {
  return (
    <>
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 px-4 py-3 shadow-sm backdrop-blur lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-ink">Sports Connect</p>
            <p className="truncate text-xs text-slate-500">Find your game, wherever you are.</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-action/10 text-action">
            <MapPinned className="h-5 w-5" aria-hidden />
          </div>
        </div>
      </header>

      <aside className="hidden border-r border-slate-200/80 bg-white/95 lg:flex lg:min-h-screen lg:w-72 lg:flex-col lg:backdrop-blur">
        <div className="border-b border-slate-200 px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-action/10 text-action">
              <MapPinned className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <p className="text-lg font-semibold text-ink">Sports Connect</p>
              <p className="text-xs text-slate-500">Find your game, wherever you are.</p>
            </div>
          </div>
        </div>
        <nav className="flex flex-col gap-2 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  [
                    "focus-ring flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition",
                    isActive ? "bg-ink text-white shadow-soft" : "text-slate-600 hover:bg-field hover:text-ink"
                  ].join(" ")
                }
              >
                <Icon className="h-4 w-4" aria-hidden />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200/80 bg-white/95 px-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 shadow-[0_-12px_28px_rgba(24,33,47,0.12)] backdrop-blur lg:hidden">
        <div className="mx-auto grid max-w-md grid-cols-6 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  [
                    "focus-ring flex min-w-0 flex-col items-center gap-1 rounded-lg px-1.5 py-2 text-[10px] font-semibold transition",
                    isActive ? "bg-action/10 text-action" : "text-slate-500 hover:bg-field hover:text-ink"
                  ].join(" ")
                }
              >
                <Icon className="h-4 w-4" aria-hidden />
                <span className="max-w-full truncate">{item.mobileLabel}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </>
  );
}
