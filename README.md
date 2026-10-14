# Tyler’s Signal Command Center

A private Sites application with 15 real routes, source-linked evidence, stored research, charts, comparison boards, scenario calculators and explainable in-app alerts. Built with TypeScript, React, Vinext, Cloudflare Workers, D1 and Drizzle.

## What works

- Overview, Long COVID Research, Clinical Trials, Wastewater, Local Housing, National Housing, AI Companies, AI Governance, Geopolitics, Economy, Texas Infrastructure, Connections, Library, Alerts, and Sources/Settings.
- Shared evidence drawer with URL deep links, source provenance, registry eligibility/contacts/endpoints/results, publication metadata and original source fields.
- Source-linked manual entries for every research domain; saved evidence, tagged private notes, favorite pages, search, saved filter views, watchlists, dark/light preference and sidebar preference.
- D1 persistence for user workspace, public records, record snapshots, field changes and latest ingestion status. Client workspace survives route transitions; writes are serialized and saves report failure.
- Source data charts with exact hover values and accessible table alternatives, missing values preserved, units, scope and observation dates. No arbitrary risk gauges or fabricated statistics.
- Registry recruitment filter, full-text metadata filter, real-coordinate map links, disclosed straight-line distances from Smithville, and a calendar of future source-listed completion estimates.
- Local ownership-cost calculator with editable assumptions, saved scenario and export; purchasing-power calculator based on a selected January CPI observation and an entered basket.
- Boards of two to four records, hypothesis, supporting evidence and counterevidence, export, and independent panel ranges/units.
- Alert dry runs with metric, threshold direction, consecutive valid observations, freshness, cooldown and acknowledgement. Source changes feed structured briefs; initial baseline ingestion is not claimed as a new development.
- Workspace backup/restore with schema validation; public source snapshot export; per-record citation copying and JSON export.
- Owner-private hosting with ChatGPT sign-in. Every API requires identity; writes require a matching Origin. User notes are keyed by the platform user ID. No external AI processing of notes.

## Sources and coverage

ClinicalTrials.gov API v2: the most recently updated 100 Long COVID search results, plus up to 100 Ensitrelvir search results, deduplicated by NCT ID. This is a bounded monitor, not an exhaustive registry mirror. Some studies concern prevention or acute infection rather than established Long COVID. Registry-listed recruitment does not confirm a site is enrolling or that Tyler qualifies.

PubMed E-utilities: 30 latest matching Long COVID treatment/trial/biomarker publications. Titles, authors, journal and publication types are indexed metadata. Full texts, effect sizes, study quality and conflicts require review; indexing does not prove efficacy.

CDC dataset j9g8-acpt: latest 1,000 Texas raw wastewater rows. Grouped by site, PCR target, units, sample matrix and laboratory method. Each site retains its reported counties served, sampling date and limitations. Local view uses source-listed Travis/Hays/Bastrop context if returned. This is not a statewide aggregation, not proof of Bastrop coverage, and not individual infection probability. Missing source history is not interpolated. The 1,000-row window can omit sites and older samples. Duplicate same-day observations use the last returned source row; review full source for analysis requiring replicate handling.

FRED public CSV: CPIAUCSL, PCEPI, UNRATE, FEDFUNDS, MORTGAGE30US, USSTHPI, TXSTHPI and DSPIC96, from 2010. Source scope, seasonal adjustment and units are labeled. The runtime request timed out in local testing, so a **real, dated source snapshot captured October 12, 2026** is bundled for fallback. Snapshot labels and original retrieval times remain visible. FRED source health reports snapshot mode; this is not a fresh live observation. Runtime fetching is attempted again according to caching. FRED's graph CSV route may require a keyed API alternative if hosted fetching is restricted.

Source references are linked in the product. Public access does not imply unrestricted redistribution rights; review provider and underlying series terms before exporting or republishing at scale.

## Material limits / configuration remaining

The whole navigation and persistence architecture is usable, but several specialist modules are curated research workspaces, not automatically populated feeds:

- Local closed-sale comps, listing histories, commercial opportunities and rental feeds are not connected. Texas appraisal values are not closed-sale prices. A legitimate licensed/local data source is required for local market statistics and property maps.
- Company financial/quote feeds, relationship graph, private valuations and audited bubble-indicator datasets are not connected. No tickers, market status, live quotes, valuations or investment positions are inferred.
- Policy enforcement, model evaluations, geopolitical events and Central Texas projects require source-linked curation. No automated geopolitical forecasts, vendor-comparison scores, legal-status classifications or incident verification are claimed.
- Full embedded map layers, disputed-boundary world maps, housing scatterplots, statistical cross-domain correlations and mechanism relationship graphs are not implemented. Trials have real-coordinate links; maps with no verified coordinates remain unavailable.
- Research categories are review scaffolding, not populated treatment recommendations. Detailed study evidence extraction and quality assessment remain manual. Source JSON is available for investigation.
- Clinical filters are registry recruitment plus metadata search. Age, mechanism, remote participation and exact distance from a customizable home coordinate are not specialized filters. Distance uses the disclosed fixed Smithville origin; configurable geography does not relabel source data.
- Alerts run in-app on opening the alert page. They do not run while the app is closed. Duration means valid observations, not elapsed days; omitted missing values are disclosed. There is no external delivery or unattended scheduler. Daily/weekly/monthly brief timing is a desired preview setting, not an active automation. Quiet hours and channel configuration are not implemented.
- Briefs list actual source-field changes with before/after values; personal relevance ranking, rich AI synthesis and automated counterevidence retrieval are not enabled. No AI key is required.
- Storage uses whole-workspace serialized writes. Concurrent edits in different browser sessions can overwrite one another. Export before multi-session editing. Source-health storage keeps the latest run per provider; record-change history is retained, but a separate UI for every historical ingestion run is not implemented.
- JSON and citation export work. CSV/RIS/BibTeX, legal full-text indexing, cross-domain board layout export, retention controls and end-to-end encryption are not implemented. Database privacy is enforced by private hosting and authenticated access, not client-side encryption.
- Scenario estimates exclude PMI, utilities, tax effects, renovations and special loan products. The purchasing-power basket uses headline CPI uniformly, not individual category indices; category inflation requires additional series.

These limits are explicit rather than filled with synthetic statistics. Synthetic inputs in tests never enter briefs or production source records. Runtime databases and local test notes are excluded from deployment archives.

## Run locally

Requires Node 22.13+ and npm. From this directory:

```powershell
npm ci
npm run build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_stale_wong.sql
npm run dev
```

Use the printed localhost URL. The portable development profile provides a loopback-only mock sign-in. Production builds exclude that mock and rely on Sites' private access and platform sign-in. Local D1 and hosted D1 are separate; do not replay already-applied migrations.

Windows note: the host npm command shim resolved its own installation directory incorrectly during helper execution. Dependencies were installed using Node and the official npm CLI directly with a writable checkout-local cache. An ignored local copy of the host npm package under node_modules/npm allowed the standard Sites build helper to run. This is an environment workaround, not application code.

## Source adapters and secrets

Adapters live in lib/ingest.ts; source catalog and series definitions in lib/catalog.ts. Add validated normalized records with stable IDs, real provider links, scope, units, observation date, retrieval time, evidence type and transformation/limitations. Keep missing data null. Add field-diff coverage when changing normalization. Preserve the last valid record on failure and report partial outcomes. Do not downgrade a newer record to an older bundled snapshot.

Refresh POST is authenticated and same-origin. Successful adapters are cached for 24 hours; CDC for seven days. A failed refresh does not erase stored data. Failed requests retry once. There are no external scheduled jobs. Adapt source cadence and retry strategy when adding a provider.

No secrets are required now. .env.example lists optional future keys only. Configure production secrets with Sites runtime environment tools, never in the browser or hosting manifest. Any AI integration must be opt-in for private notes and grounded in source records.

## Validation

```powershell
node node_modules/typescript/bin/tsc --noEmit
node --experimental-strip-types --test tests/calculations.test.mjs tests/changes.test.mjs
# With the dev server running and migrations applied:
node --test tests/workspace.test.mjs
```

Eight unit tests cover financial calculations, missing/freshness/cooldown alert behavior, geographic distances and source changes/revisions. Four integration tests cover unauthenticated access, cross-origin writes, persisted notes/preferences/watchlists, all 15 routes and provenance/null-safe series. The persistence test restores the original local workspace.

Browser inspection covers desktop/mobile overview, recruitment/intervention filtering, evidence provenance and deep links, chart table alternative, ownership calculator, responsive navigation and light theme. Type checking and production build are required before packaging. Hosted source availability may differ from local results; source-health states remain authoritative.

## Trust & Safety — local build (October 14, 2026)

The Trust & Safety route now has eight logical subtabs, five distinct source-registry benchmarks, an 18-metric operational dictionary, exact cadence normalization, scope filters, source reconciliation, a defensive economics scenario explorer, and browser-local CSV/JSON import/export. No status badge appears under the Google cross-product benchmark. Its estimate provenance remains in the methodology ledger. Public sources were rechecked October 14; publication and observation dates remain separate.

This change is local only. It was not synchronized to Sites, deployed, or pushed to GitHub. Run `npm run dev` from this directory and open `http://127.0.0.1:5173/trust-safety`. Existing dependencies are installed. Production verification: `node node_modules/typescript/bin/tsc --noEmit`, `node --experimental-strip-types --test tests/trust-safety.test.mjs`, `npm run build`.

Operational metrics require imported observations with matching entity, scope, period and denominators. The supplied public benchmarks do not establish harm, protection coverage, AI attribution, unique campaigns, realized fraud loss, detection recall or actual defense spending. Browser-local storage and downloaded configuration files are independent of hosted D1. Scenario assumptions never enter observed provider benchmarks. Imports replace the local operational observation array; export before replacing it.

Observation CSV uses metadata columns plus a JSON `fields` cell. Scenario CSV uses `field,value`; configuration JSON combines scenario, editable Google baseline and observations. Evidence exports retain unknown values as null. To populate a metric, use its dictionary ID as observation `id`, its exact entity, observation start/end, a supported evidence status and the named numeric fields. A template is available in Evidence & methodology.

## AI Capability & U.S. Continuity Observatory

Capabilities now uses eleven subtabs and a common measurement registry. `lib/capability-observatory.ts` defines typed sources, organizations, models, evaluated systems, evaluations, timestamped observations, infrastructure assets, dependencies, initiatives, incidents, outcomes, theses and continuity scenarios. The initial numeric evidence includes METR TH 1.1 p50/p80 fits and source intervals for 26 evaluated systems, historical 2023 all-data-center electricity use, and an early-2025 developer-productivity RCT. These are dated snapshots, not live feeds or complete current-model rankings. METR's publisher page no longer actively updates. A model's release date is never used as its measurement date; unknown dates, budgets and sample counts stay explicit.

The page includes scope/date/evidence/freshness filters, model/version comparisons with mismatch warnings, method/source drawers, exact-value chart tables, watchlists, saved views, editable AGI/ASI working definitions and seven user-originated thesis records. No AGI percentage or composite score is inferred. Stargate and Genesis records use dated official sources; secured or announced capacity is not treated as commissioned power or compute. The dependency and Human Pathome views are explicitly conceptual schemas, not verified operational inventories or biological mechanisms.

Continuity scenarios use abstract service units, independent backup, switching delay, finite buffer, backup endurance, minimum service, RTO/RPO and entered response costs. Actual recovery drills remain unmeasured. Model-based alternatives do not prove a provider or service is available. The cost workbench includes supervision and rework. Local edits, uploads and scenario settings persist in browser-local storage and can be exported/restored as JSON; filtered observation tables export to CSV/JSON. They do not sync to hosted D1. Import validation requires unique observation IDs and known source IDs; adding new source/evaluation definitions currently requires a code update. No operational telemetry, secrets or private infrastructure details are bundled.

Validate with `node --experimental-strip-types --test tests/capability-observatory.test.mjs`, TypeScript and `npm run build`. `scripts/import-capability-metr.mjs PUBLIC_YAML_FILE RETRIEVAL_DATE` regenerates the pinned numeric extract; it checks the known YAML shape and records the source SHA-256. Review source changes and publication status before refreshing. No API is assumed for the public program and study references.
