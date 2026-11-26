# Alicia Rosales Tarot

Mobile-first landing page for Alicia Rosales, a tarot reader based in Córdoba, Argentina. Visitors can explore the services, try a three-card reflection, and contact Alicia directly on WhatsApp.

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

- `artifacts/alicia-tarot/src/App.tsx` — landing page and interactive card spread
- `artifacts/alicia-tarot/src/config/siteData.ts` — phone, social profile, services, tarot cards, FAQs, and legal copy
- `artifacts/alicia-tarot/src/index.css` — shared page palette, typography, and motion
- `artifacts/alicia-tarot/index.html` — page title, description, and social-sharing metadata

## Architecture decisions

- The tarot interaction is a symbolic reflection exercise; the UI does not make predictions or promise control over another person's choices.
- Do not create fictional customer reviews. Publish testimonials only when Alicia has permission to share them.
- WhatsApp is the only contact conversion path; its links also emit optional GTM and Meta Pixel events when those globals are present.

## Product

The site presents a free initial tarot reading and orientation by WhatsApp, five service descriptions, an interactive three-card spread, FAQs, and privacy, terms, and legal dialogs.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
