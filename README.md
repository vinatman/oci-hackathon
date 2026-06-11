# Sports Connect

“Find your game, wherever you are.”

Sports Connect is a concise full-stack hackathon MVP for traveling sports fans. It helps a demo user pick a favorite sport/team, choose current location or a supported demo city, find upcoming games, and discover nearby venues where those games are likely to be shown.

The MVP intentionally has no signup, login, passwords, JWT, OAuth, paid APIs, real-money betting, or production scraping. It uses seed data, mock providers, and deterministic rules so the demo stays clean and runnable.

## Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS
- Maps: Leaflet, react-leaflet, OpenStreetMap tiles
- Backend: Node.js, Express, TypeScript
- Database: PostgreSQL
- ORM: Prisma
- Validation: Zod
- Package manager: npm
- Containers: Docker and Docker Compose
- Cloud target: Oracle Cloud Infrastructure through OCI CLI scripts

## Local Setup

```bash
npm install
cp .env.example .env
```

If npm is configured to an unavailable private registry, install with:

```bash
npm install --registry=https://registry.npmjs.org/
```

## PostgreSQL Setup

With Docker:

```bash
docker compose up -d postgres
```

Or run your own PostgreSQL instance and set:

```bash
DATABASE_URL=postgresql://sportsconnect:sportsconnect@localhost:5432/sportsconnect?schema=public
```

## Prisma Migration And Seed

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

Root `npm run db:*` commands read the root `.env`. If you run Prisma commands directly from `backend`, either export `DATABASE_URL` first or copy `backend/.env.example` to `backend/.env`.

The seed creates 12 teams, 12 upcoming games, 20 seeded venues across 8 cities, 8 venue-team affinities, 5 ad placements, 5 partner offers, 5 mock ticket offers, and a demo user profile.

## Run Locally

Backend:

```bash
npm run dev -w backend
```

Frontend:

```bash
npm run dev -w frontend
```

Open [http://localhost:5173](http://localhost:5173). The API defaults to [http://localhost:4000](http://localhost:4000).

## Docker Build And Run

```bash
docker compose up --build
```

Then open [http://localhost:5173](http://localhost:5173). Compose starts Postgres, runs migrations and seed data, starts the API, and serves the frontend through Nginx.

## Tests And Build

```bash
npm test
npm run build
```

The focused MVP tests cover demo defaults, profile validation, favorite team add/remove logic, confidence scoring, premium ad suppression, agent cards, and list/map view persistence.

## Demo Flow

1. Start Demo from the Home page.
2. Edit Profile preferences and optionally toggle Premium ad-free mode.
3. Pick sport, league, team, upcoming game, location, venue type, and radius in Venue Finder.
4. Click Find Venues.
5. Review upcoming games, ranked venue cards, agent recommendations, and monetization widgets.
6. Switch between List and Map view.
7. Save a venue.
8. Ask the rule-based assistant a query.
9. Toggle Premium and confirm advertising disappears while tickets, assistant, list view, and map view remain available.

## List And Map Views

Venue Finder defaults to List view. The last selected view is stored in `localStorage` under `sports-connect-results-view`.

Map view uses seeded latitude/longitude and OpenStreetMap tiles. If venue coordinates are unavailable, the UI falls back to List view and displays: “Map view needs venue coordinates. Try current location or choose a supported demo city.”

## Monetization Modules

- Find Tickets: mock ticket offers only, visible when relevant to a selected or matched game.
- Betting Partner: disabled by default with `ENABLE_BETTING_WIDGET=false`; no odds, advice, deposits, or real-money wagering.
- Advertising: clearly labeled sponsored placements; hidden for premium users.
- Partner Promotions: food, rideshare, merchandise, streaming, and fan-club placeholders.

To disable ads or betting:

```bash
ENABLE_AD_WIDGET=false
ENABLE_BETTING_WIDGET=false
VITE_ENABLE_AD_WIDGET=false
VITE_ENABLE_BETTING_WIDGET=false
```

Premium ad-free is a simple `User.isPremium` boolean. The Profile page exposes it as “Premium ad-free experience.” When enabled, advertising placements and sponsored ad CTAs are hidden, while tickets and core recommendations remain available.

## Provider Architecture

The backend defines provider interfaces for:

- `VenueDiscoveryProvider`
- `GameDiscoveryProvider`
- `TicketProvider`
- `BettingProvider`
- `AdProvider`
- `PartnerOfferProvider`

Mock providers power the MVP. Placeholder providers show where web search, partner venue feeds, Ticketmaster, and external sports APIs can be added later.

## OCI Deployment

OCI deployment files live in [deploy/oci](./deploy/oci):

- `env.example`
- `deploy.sh`
- `cleanup.sh`
- `README.md`

Prerequisites:

- OCI CLI installed and configured.
- Docker installed locally.
- OCIR auth token.
- A PostgreSQL database reachable from OCI.
- Required environment variables from `deploy/oci/env.example`.
- Optional domain and OCI certificate OCID for HTTPS.

Usage:

```bash
cp deploy/oci/env.example deploy/oci/.env
set -a
source deploy/oci/.env
set +a
./deploy/oci/deploy.sh
```

The script validates the OCI CLI and required environment variables, builds backend/frontend Docker images, tags and pushes them to OCI Container Registry, creates or reuses network resources where practical, deploys OCI container resources, configures app environment variables, and prints the final URL.

If `APP_DOMAIN` and `TLS_CERTIFICATE_OCID` are supplied, the script creates an HTTPS load balancer listener, prints the load balancer IP needed for DNS, and prints `https://APP_DOMAIN`. If not supplied, it prints the public HTTP endpoint and states that full HTTPS requires a domain, certificate OCID, and DNS pointed at the OCI load balancer.

No OCI OCIDs are hardcoded. Do not commit real secrets.

## Backend Environment

```bash
DATABASE_URL=
PORT=4000
ENABLE_WEB_SEARCH_PROVIDER=false
ENABLE_TICKETS_WIDGET=true
ENABLE_BETTING_WIDGET=false
ENABLE_AD_WIDGET=true
ENABLE_PARTNER_PROMOTIONS=true
TICKETMASTER_API_KEY=
SPORTS_DATA_API_KEY=
```

## Frontend Environment

```bash
VITE_API_BASE_URL=http://localhost:4000
VITE_ENABLE_ASSISTANT=true
VITE_ENABLE_TICKETS_WIDGET=true
VITE_ENABLE_BETTING_WIDGET=false
VITE_ENABLE_AD_WIDGET=true
```

Never expose database passwords or backend secrets in frontend variables.

## Known MVP Limitations

- Demo-only local user stored in `localStorage`.
- No real authentication or account recovery.
- No paid sports, maps, ticketing, ad, or betting APIs.
- Venue/game data is seeded and mock-driven.
- Assistant is deterministic and rule-based, not an LLM.
- OCI scripts are intentionally simple and may need tenant-specific networking, security-list, DNS, and certificate adjustments.

## SaaS Extensibility Roadmap

- Real user accounts and organization-managed profiles.
- Venue owner dashboards for claimed venues, watch schedules, and capacity.
- Advertiser dashboards and paid ad campaign management.
- Ticketing integrations such as Ticketmaster.
- Sports data integrations for live schedules and broadcasts.
- Real LLM assistant with retrieval over teams, venues, offers, and user context.
- Notifications for game reminders and venue changes.
- Team fan communities and traveling supporter groups.
- Premium subscriptions and ad-free billing.
- Analytics for searches, venue saves, ad performance, and conversion.
- Multi-tenant SaaS controls for venues, advertisers, and regional operators.
- Regional compliance controls for betting modules.
