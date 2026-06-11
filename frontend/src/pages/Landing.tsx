import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Compass,
  Globe2,
  GraduationCap,
  MapPinned,
  MessageSquareText,
  PhoneCall,
  Search,
  ShieldCheck,
  Star,
  UsersRound
} from "lucide-react";
import { Link } from "react-router-dom";

const problemSources = [
  { label: "Generic map searches", icon: Search },
  { label: "Reddit threads", icon: MessageSquareText },
  { label: "Fan groups", icon: UsersRound },
  { label: "Outdated team bar lists", icon: Star },
  { label: "Venue websites", icon: Globe2 },
  { label: "Phone calls to bars", icon: PhoneCall }
];

const fanTypes = [
  { label: "Business travelers", icon: BriefcaseBusiness },
  { label: "Conference attendees", icon: Building2 },
  { label: "Relocated fans", icon: MapPinned },
  { label: "College alumni", icon: GraduationCap },
  { label: "International soccer supporters", icon: Globe2 },
  { label: "Fans in unfamiliar cities", icon: Compass }
];

const beforeItems = ["Search generic sports bars", "Check forums and fan groups", "Call venues manually", "Hope the game is on"];
const afterItems = [
  "Pick favorite teams",
  "Share or enter location",
  "Get ranked venues with confidence and evidence",
  "Save trusted spots for future trips"
];

const fanFitSignals = ["Team match", "Watch-party signals", "Distance", "Venue type", "Saved by fans"];

export function Landing() {
  return (
    <main className="min-h-screen bg-field text-ink">
      <Hero />
      <ProblemSection />
      <FansOnTheMoveSection />
      <BeforeAfterSection />
      <WhyDifferentSection />
      <InvestmentSection />
    </main>
  );
}

function Hero() {
  return (
    <section className="relative isolate min-h-[92vh] overflow-hidden bg-ink text-white">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-ink" />
        <div className="absolute left-[8%] top-24 h-px w-[78%] rotate-[-8deg] border-t border-dashed border-white/15" />
        <div className="absolute left-[18%] top-[58%] h-px w-[62%] rotate-[10deg] border-t border-dashed border-white/15" />
        <div className="absolute right-12 top-24 hidden w-80 rounded-lg border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur lg:block">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-200">Away game search</p>
          <div className="mt-3 grid gap-2">
            {["Favorite team", "Current city", "Venue confidence"].map((label) => (
              <div key={label} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200">
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <Link to="/" className="focus-ring inline-flex items-center gap-3 rounded-lg">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-white/10 text-emerald-200">
            <MapPinned className="h-5 w-5" aria-hidden />
          </span>
          <span>
            <span className="block text-base font-semibold">Sports Connect</span>
            <span className="block text-xs text-slate-300">Find your game, wherever you are.</span>
          </span>
        </Link>
        <Link
          to="/dashboard"
          className="focus-ring hidden rounded-lg border border-white/25 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10 sm:inline-flex"
        >
          Try demo account
        </Link>
      </header>

      <div className="mx-auto grid min-h-[calc(92vh-84px)] max-w-7xl content-center gap-10 px-5 pb-20 pt-8 sm:px-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center">
        <div className="max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-200">For traveling sports fans</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            Find the right place to watch your team, wherever you travel.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
            Sports Connect helps traveling fans discover nearby venues that are likely to show games for their favorite
            teams, with confidence scores and evidence so they do not have to guess.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/venue-finder"
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-ink shadow-soft transition hover:bg-emerald-50"
            >
              Find venues near me
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              to="/dashboard"
              className="focus-ring inline-flex items-center justify-center rounded-lg border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Try demo account
            </Link>
          </div>
          <div className="mt-7 lg:hidden">
            <FanFitCard tone="dark" />
          </div>
          <p className="mt-6 max-w-xl rounded-lg border border-white/10 bg-white/5 p-3 text-xs leading-5 text-slate-300">
            Hackathon demo note: this build uses seeded games, venues, and mock providers to show the experience without
            paid APIs or unverified live venue claims.
          </p>
        </div>

        <div className="hidden lg:block" aria-hidden>
          <div className="rounded-lg border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur">
            <div className="rounded-lg bg-white p-4 text-ink">
              <FanFitCard />
              <div className="mt-4 rounded-lg border border-slate-200 bg-field p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-action">Los Angeles</p>
                    <h2 className="mt-1 text-lg font-semibold">Lakers watch plan</h2>
                  </div>
                  <span className="rounded-lg bg-action/10 px-3 py-2 text-sm font-semibold text-action">92%</span>
                </div>
                <div className="mt-4 grid gap-3">
                  <PreviewCard title="Tom's Watch Bar" meta="Sports bar · 1.8 km" score="93%" />
                  <PreviewCard title="33 Taps Silver Lake" meta="Restaurant · LAFC and Lakers screens" score="84%" />
                  <PreviewCard title="LA Fan Club House" meta="Fan club · saved by travelers" score="78%" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FanFitCard({ tone = "light" }: { tone?: "light" | "dark" }) {
  const isDark = tone === "dark";

  return (
    <article
      className={[
        "rounded-lg border p-4 shadow-soft",
        isDark ? "border-white/15 bg-white/10 text-white backdrop-blur" : "border-action/20 bg-white text-ink"
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className={["text-xs font-semibold uppercase tracking-[0.12em]", isDark ? "text-emerald-200" : "text-action"].join(" ")}>
            Smart matching
          </p>
          <h3 className="mt-1 text-xl font-semibold">Fan Fit at a Glance</h3>
        </div>
        <span
          className={[
            "rounded-lg px-3 py-2 text-sm font-semibold",
            isDark ? "bg-emerald-200 text-ink" : "bg-action/10 text-action"
          ].join(" ")}
        >
          92%
        </span>
      </div>
      <p className={["mt-3 text-sm leading-6", isDark ? "text-slate-200" : "text-slate-600"].join(" ")}>
        We score each venue against your teams, city, venue style, and game-day signals, so you know where to watch
        before kickoff.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {fanFitSignals.map((signal) => (
          <span
            key={signal}
            className={[
              "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold",
              isDark ? "border-white/15 bg-white/10 text-slate-100" : "border-action/15 bg-action/10 text-action"
            ].join(" ")}
          >
            <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
            {signal}
          </span>
        ))}
      </div>
      <p className={["mt-4 text-sm font-semibold", isDark ? "text-emerald-200" : "text-ink"].join(" ")}>
        Less guessing. More cheering.
      </p>
    </article>
  );
}

function PreviewCard({ title, meta, score }: { title: string; meta: string; score: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-field p-3">
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-1 text-xs text-slate-600">{meta}</p>
      </div>
      <span className="rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-action">{score}</span>
    </div>
  );
}

function ProblemSection() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:py-20">
      <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-action">The problem</p>
          <h2 className="mt-2 text-3xl font-semibold text-ink">Finding the game is still too manual.</h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Out-of-market fans often piece together answers across maps, forums, old lists, venue websites, and phone
            calls. That is a lot of work for something that is time-sensitive.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {problemSources.map((item) => (
            <InfoRow key={item.label} icon={item.icon} label={item.label} />
          ))}
        </div>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <ValueCard title="Kickoff does not wait" description="Fans need a confident answer before the game starts." />
        <ValueCard title="Nearest is not always right" description="The closest sports bar may not show the user's team." />
        <ValueCard title="Bad info ruins the night" description="Outdated venue details can mean missed kickoff or watching alone." />
      </div>
    </section>
  );
}

function FansOnTheMoveSection() {
  return (
    <section className="border-y border-slate-200/80 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:py-20">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-action">Built for fans on the move</p>
          <h2 className="mt-2 text-3xl font-semibold text-ink">The target user already exists. They just need a better tool.</h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Sports Connect is for fans who care where they watch, not just whether a screen is nearby.
          </p>
        </div>
        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {fanTypes.map((item) => (
            <InfoRow key={item.label} icon={item.icon} label={item.label} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BeforeAfterSection() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:py-20">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-action">Before and after</p>
        <h2 className="mt-2 text-3xl font-semibold text-ink">From guessing to a ranked watch plan.</h2>
      </div>
      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <ComparisonCard tone="before" title="Before Sports Connect" items={beforeItems} />
        <ComparisonCard tone="after" title="After Sports Connect" items={afterItems} />
      </div>
    </section>
  );
}

function WhyDifferentSection() {
  return (
    <section className="bg-ink text-white">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:py-20">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-200">Why Sports Connect is different</p>
          <h2 className="mt-2 text-3xl font-semibold">Maps show bars. Sports Connect starts with the fan's team.</h2>
          <p className="mt-4 text-base leading-7 text-slate-200">
            Generic maps can tell fans what is nearby, but not whether a venue is likely to show their game. Team bar
            lists are fragmented and often stale. Sports Connect ranks venues by team affinity, venue type, location,
            distance, and explainable evidence.
          </p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <DarkValueCard title="Team-first matching" description="The search starts with favorite teams, not generic nightlife." />
          <DarkValueCard title="Confidence with evidence" description="Fans can see why a venue ranked well before heading out." />
          <DarkValueCard title="Reusable trip memory" description="Saved spots create a trusted playbook for future travel." />
        </div>
      </div>
    </section>
  );
}

function InvestmentSection() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:py-20">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-action">Built to grow</p>
          <h2 className="mt-2 text-3xl font-semibold text-ink">A focused MVP with room for a real network business.</h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            The demo is intentionally concise, but the architecture keeps provider integrations, venue discovery,
            monetization modules, and user preferences separate so the product can expand without rewriting the core.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/venue-finder"
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg bg-action px-5 py-3 text-sm font-semibold text-white"
            >
              Find venues near me
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              to="/dashboard"
              className="focus-ring inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-ink"
            >
              Try demo account
            </Link>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <ValueCard title="Venue owner tools" description="Future dashboards for claiming venues and improving game listings." />
          <ValueCard title="Fan communities" description="Team-specific watch groups and trip planning around big games." />
          <ValueCard title="Provider marketplace" description="Sports data, ticketing, promotions, and venue sources can plug in modularly." />
          <ValueCard title="Regional controls" description="Compliance boundaries can keep sensitive modules isolated by market." />
        </div>
      </div>
    </section>
  );
}

function InfoRow({ icon: Icon, label }: { icon: typeof Search; label: string }) {
  return (
    <div className="app-card flex items-center gap-3 p-4">
      <span className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-action/10 text-action">
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <p className="text-sm font-semibold text-ink">{label}</p>
    </div>
  );
}

function ValueCard({ title, description }: { title: string; description: string }) {
  return (
    <article className="app-card p-5">
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </article>
  );
}

function DarkValueCard({ title, description }: { title: string; description: string }) {
  return (
    <article className="rounded-lg border border-white/15 bg-white/10 p-5">
      <h3 className="text-base font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-200">{description}</p>
    </article>
  );
}

function ComparisonCard({ title, items, tone }: { title: string; items: string[]; tone: "before" | "after" }) {
  const isAfter = tone === "after";

  return (
    <article className={["rounded-lg border p-5 shadow-soft", isAfter ? "border-action/30 bg-white" : "border-slate-200 bg-white"].join(" ")}>
      <div className="flex items-center gap-3">
        <span
          className={[
            "flex h-10 w-10 items-center justify-center rounded-lg",
            isAfter ? "bg-action/10 text-action" : "bg-slate-100 text-slate-500"
          ].join(" ")}
        >
          {isAfter ? <CheckCircle2 className="h-5 w-5" aria-hidden /> : <ShieldCheck className="h-5 w-5" aria-hidden />}
        </span>
        <h3 className="text-lg font-semibold text-ink">{title}</h3>
      </div>
      <ul className="mt-5 grid gap-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-6 text-slate-700">
            <BadgeCheck className={["mt-0.5 h-4 w-4 flex-none", isAfter ? "text-action" : "text-slate-400"].join(" ")} aria-hidden />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
