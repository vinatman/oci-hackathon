import { Bot, Heart, Home, MapPinned, Star, UserCircle } from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Dashboard", icon: Home, end: true },
  { to: "/profile", label: "Profile", icon: UserCircle, end: false },
  { to: "/favorite-teams", label: "Favorite Teams", icon: Star, end: false },
  { to: "/venue-finder", label: "Venue Finder", icon: MapPinned, end: false },
  { to: "/saved-venues", label: "Saved Venues", icon: Heart, end: false },
  { to: "/assistant", label: "Assistant", icon: Bot, end: false }
];

export function Sidebar() {
  return (
    <aside className="border-b border-slate-200 bg-white lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r">
      <div className="flex h-full flex-col">
        <div className="border-b border-slate-200 px-5 py-5">
          <p className="text-lg font-semibold text-ink">Sports Connect</p>
          <p className="text-xs text-slate-500">Find your game, wherever you are.</p>
        </div>
        <nav className="flex gap-1 overflow-x-auto p-3 lg:flex-col lg:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  [
                    "focus-ring flex min-w-max items-center gap-2 rounded px-3 py-2 text-sm font-medium transition",
                    isActive ? "bg-action text-white" : "text-slate-600 hover:bg-field hover:text-ink"
                  ].join(" ")
                }
              >
                <Icon className="h-4 w-4" aria-hidden />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
