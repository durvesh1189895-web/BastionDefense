# Bastion Defense UI

A polished, landscape-first Bastion Defense game UI shell with local sample data and open integration points for gameplay, economy, map launching, and audio systems.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/bastion-defense-ui/src/App.tsx` — screen state, presentation data, asset slots, and the `BastionUiAdapter` integration surface.
- `artifacts/bastion-defense-ui/src/index.css` — shared visual language and responsive landscape layout.
- `artifacts/bastion-defense-ui/public/assets/` — optional production art drop-in location; filenames are declared in `assetSlots`.

## Architecture decisions

- The UI is a standalone frontend shell with sample presentation data; it does not own gameplay, economy, progression, or payment state.
- `BastionUiAdapter` is intentionally optional so a host game can attach campaign launch, defense upgrade, purchase, and SFX volume handlers without changing screen components.
- Missing art files fail silently to the designed visual placeholders, so asset delivery cannot break the UI.
- Core screens use a fixed landscape viewport with touch-friendly controls and no vertical scrolling.

## Product

- Main Menu with primary Play action and navigation to Store, Sound, Settings, and three future feature stubs.
- Swipeable/snap Campaign Select carousel with selected, locked, progress, and enter states.
- Store with exactly four tabs: Defenses, Gold, Diamonds, and Special Offers.
- Defense selection and stats/upgrade presentation, currency package purchase UI, exactly four promotional offers, and SFX volume control.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
