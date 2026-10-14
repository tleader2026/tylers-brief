# Tyler's Brief — online continuation

This repository is the complete source for the existing owner-private dashboard at https://tyler-signal-command-center.vividsiren2.chatgpt.site/. Preserve the existing design and navigation. The current Sites project is declared in `.openai/hosting.json`; do not create a replacement site.

## Start here

- Node.js 22.13 or newer. Run `npm run install:ci`, then `npm run dev`.
- Check TypeScript with `node node_modules/typescript/bin/tsc --noEmit`.
- Build with `npm run build`. Run relevant `scripts/test-*.mjs` checks for the area changed.
- Pages/navigation: `lib/catalog.ts` and `app/command-center.tsx`. Domain dashboard components live in `app/`; adapters, evidence dictionaries and dated fallback snapshots live in `lib/`.
- The production app uses Cloudflare Workers, D1, and owner-private ChatGPT authentication. The source is portable; the existing hosted D1 database and cloud schedules are external resources, not part of a Git clone. Local data starts from bundled snapshots until the local database is initialized or sources are refreshed.
- Read `.openai/refresh-instructions.md` before changing data collection. Refresh exceptions include Watchlist and Vint Cerf; descriptive cards are static.
- Keep credentials server-side and out of Git. Preserve source dates, original observations, missing-data states, and stale/error indicators. Never replace unknown values with invented current measurements.

## Current layout

Executive Summary: Today, Measurements.
U.S. LongCovid: Theories, Active Trials, Exposure Risk, Population Health.
U.S. Infrastructure: Housing, Utilities, Logistics, Agriculture, Space Systems.
U.S. ASI Progress: Capabilities, Governance, Robotics.
U.S. ASI Markets: Labor, Companies, Market Signals, Supply Chains.
U.S. Global: Geopolitics, Economy, Internet.

Robotics is a new placeholder below Governance, ready for a later build-out. Population Health is nationally focused, with 10 subtabs after removal of Recovery & Research. It has source-backed metrics and honest placeholders. Repeated explanatory cards removed at the user's request must not be restored. Chronic Illness titles start with "Americans with". Health figures use red for adverse burden and green for health/participation/support; administrative changes do not imply recovery.

Companies are grouped into AI Pillars and AI Startups, ordered by positive operating income first, undisclosed profitability next, operating losses last. Consumer credit-card spending and effective federal funds rate charts use green-low/red-high. PCE prices and real disposable income sit together. Agriculture's Corn and Grain header is compact like Soil Status. Today subtitle: "The wider measure and macro metrics".

## Publishing and state

Use the Sites plugin workflow to synchronize, build, save, and deploy to the retained project when it is available. A GitHub push alone does not deploy this Sites app or transfer its database/scheduler credentials. Preserve owner-private access. The existing deployment continues operating independently of this repository.

Bundled snapshots and static assets are included. Hosted user notes, saved views, record revision history and cloud schedules must be exported/reconnected separately for a migration to another host. Do not make private user data public. No authentication token is included in this repository.

## Labor module

Labor has six national subtabs: Employment Overview, Beyond U-3, Stable Work & Income, Tech Hiring, Economic Consequences, Methods & Sources. My Career is intentionally omitted. Public BLS/FRED series begin in 2022; annual CPS occupation/desire tables are dated 2025 extracts with the missing-October caveat. Refresh uses labor-fred through the existing maintenance flow. `scripts/collect-labor.mjs` refreshes the bundled baseline. The historical broader-unemployment assertion is an owner-scoped runtime secret (`LABOR_ASSERTION_JSON`), excluded from source and public exports. No career history, compensation or application log is included. Missing person-level adequacy, ad histories and causal consequence datasets stay explicitly unavailable.
