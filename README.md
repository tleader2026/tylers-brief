# Tyler's Brief

An owner-private, evidence-first dashboard for tracking U.S. health, infrastructure, AI development, markets, labor, and international technology relationships. It combines public-source data, dated research panels, interactive maps and charts, private research tools, and explicit measurement definitions.

**Hosted dashboard:** [Tyler's Brief](https://tyler-signal-command-center.vividsiren2.chatgpt.site/) · access requires authorization and ChatGPT sign-in.

**Stack:** TypeScript, React, Vinext/Vite, Cloudflare Workers, Cloudflare D1, Drizzle, Recharts, Leaflet, and Lucide icons.

## Project status

This overview reflects the dashboard as of **October 15, 2026**. Features range from connected public-data adapters to curated evidence registers, dated snapshots, scenario tools, and defined measures awaiting observations. A page's existence does not imply that every metric has a live feed.

The deployed Site and this GitHub repository have separate publication workflows. **The latest Measurements implementation and the newest Progress mechanism-tracking update are deployed in Sites but have not yet been synchronized into this GitHub source snapshot.** Their current behavior is documented below; cloning this repository does not yet reproduce those latest additions. This README update changes documentation only.

## Dashboard map

Navigation is organized into six sections. Labels below describe the current hosted application; `lib/catalog.ts` defines the navigation for the checked-out source version.

| Section | Pages | Coverage |
| --- | --- | --- |
| Executive Summary | Today, Measurements, Progress | Cross-domain overview, operational measurement definitions, and observed developments in control, international exchange, and continuity |
| U.S. Health | Theories, Active Trials, Exposure Risk, Population Health, Medical Capacity, Drug Discovery | Long COVID research, trial monitoring, wastewater threats, population burden, care capacity, and AI-assisted drug development |
| U.S. Infrastructure | Housing, Utilities, Logistics, Agriculture, Space Systems | Housing conditions, energy/water/data-center dependencies, transportation, agricultural inputs and production, and space infrastructure |
| U.S. ASI Progress | Trust & Safety, Capabilities, Governance, Robotics | Abuse and defensive performance, evaluated capability, accountable governance, deployment, reliability, and industrial execution |
| U.S. ASI Markets | Tech Jobs, Companies, Market Signals, Supply Chains | Technology employment, company economics, model adoption, data markets, physical dependencies, raw materials, and component prices |
| U.S. Global | Geopolitics, Economy, Internet, Labor | International power and relationships, macroeconomic conditions, network/protocol context, employment stress, productivity, and future AI careers |

Workspace tools provide **Connections**, **Library & Notebook**, **Alerts & Briefings**, and **Sources & Settings**. A legacy local-housing route remains available. Hidden historical components should not be mistaken for active navigation.

## Major capabilities

### Measurements and Progress

**Measurements** defines 78 indicators across 13 domains, with 20 priority indicators: regional responsibility, internet continuity, user control, authority enforcement, cross-domain transitions, institutional conduits, shared registries, security, accountability, economics, geopolitical stability, U.S. participation, and optional orbital resilience.

It includes operational success gates, dependencies, a proposed milestone ladder, the metric register, evidence and forecasts, experiment requirements, and collection priorities. Definitions retain units, populations, denominators, source requirements, proposed thresholds, limitations, and decisions. Proposed gates and timelines are evaluation choices, not observed adoption or calibrated predictions. Evidence reviews and forecast revisions use the private workspace; historical entries are preserved.

**Progress** observes developments in the world using those definitions. It is not a task board for building one prototype. Its overview contains:

- Selectable 30-, 90-, and 365-day changes, distinguishing real-world event dates from publication and retrieval dates.
- Eight tracks: regional responsibility, user-owned intelligence, bounded agent authority, cross-domain continuity, institutional conduits, shared coordination, internet/service continuity, and durable U.S. participation.
- Two primary measurement links per track, a scoped milestone, evidence quality, direction, blocker, and next observation.
- Initiative-level milestone histories, dependencies, and integrated demonstrations that retain the boundaries of a single evidenced workflow.
- Four separate outcome lenses and four possible trajectories; no arbitrary overall completion percentage.

Existing deployment/control matrices, procurement evidence, migration requirements, connectivity measures, policy history, and source ledgers remain available. **Market Access** keeps global cloud-footprint, model-usage, and optical-equipment comparisons as strategic context. Infrastructure counts, protocol support, reporting activity, and probe footprint do not substitute for tested architectural outcomes.

### Health and research

- **Theories:** source-linked Long COVID research, mechanisms, biomarkers, publications, drug development, and an owner-maintained watchlist.
- **Active Trials:** bounded ClinicalTrials.gov monitoring, recruitment and metadata filters, registry details, geographic views, estimated milestone calendars, and record changes. Registry status does not confirm current site enrollment or individual eligibility.
- **Exposure Risk:** wastewater maps and histories selectable by surveillance threat and geography. Only supported datasets populate a layer; lack of coverage is not zero exposure. Wastewater does not directly measure Long COVID prevalence or individual infection probability.
- **Population Health:** acute/chronic burden, functional capacity, disability/work, leading conditions, post-infectious disease, history, and resilience. Administrative counts and different survey populations remain distinct.
- **Medical Capacity:** hospital occupancy and capacity, research funding, training, workforce health, insurance, epidemic preparedness, and treatment bottlenecks. Maps support jurisdiction and metric inspection.
- **Drug Discovery:** AI-specific program and pipeline monitoring, clinical evidence, development speed, commercial validation, patient value, and dated milestones. AI involvement, novel design, and repurposing are distinguished; clinical benefit does not by itself establish that AI caused it. Panels are curated, not an exhaustive census.

### AI, markets, and physical supply

- **Trust & Safety:** public benchmarks, threat surfaces, investigation funnels, agentic abuse, defensive economics, and operational definitions. Imported observations and scenario assumptions remain separate from public evidence.
- **Capabilities:** evaluated task performance, memory/agents, compute and energy, continuity dependencies, autonomous science, robotics, agency, and evidence. Benchmark scope, task populations, model versions, and causal versus observational results remain explicit.
- **Governance:** controls and evaluations, incidents, continuity/competition, institutional learning, policy tracking, and Systems Lab & Scenarios. Legal proposals, adopted rules, application dates, and enforcement evidence are different states.
- **Robotics:** deployment/diffusion, useful output and reliability, continuity scenarios, supply dependencies, a calculator, and metric definitions. Fleet counts or operating hours do not establish uptime without a valid exposure denominator.
- **Market Signals:** the Overview separates **Model Adoption** first and **Data Economy** second. Other views cover monetization, capital/infrastructure economics, expectations, competition/value capture, and emerging markets. Open versus proprietary model comparisons retain their measured usage scope; data-market estimates retain their source definitions.
- **Supply Chains:** Overview cost-history charts, Dependency Map, Raw Materials, Compute & Components, Power & Projects, Networks & Access, Risk & Scenarios, and Evidence & Trends. Material and data-center component tables distinguish observed prices, producer indexes, proxies, and unavailable series. The dependency-chain visualization belongs to Dependency Map.
- **Companies / Tech Jobs:** company landscapes, financial and growth evidence, bubble-risk context, and technology employment/turnover by relevant category. Broad industry flows, payroll stocks, company announcements, planned jobs, and realized hires are not interchangeable.

### Infrastructure, economy, and international context

Housing, Utilities, Logistics, Agriculture, and Space Systems combine source-backed indicators, maps, historical series, project evidence, and scoped calculators where implemented. Price, capacity, delivery stage, and actual utilization remain distinct.

Geopolitics covers alliances, defense/endurance, financial power, trade/energy, regional corridors, stability/governance, scenarios, and evidence. Economy covers macro health, purchasing power, credit stress, AI investment exposure, and human outcomes. Internet covers Vint Cerf, connectivity, provenance, protocols/addressing, and space-based systems.

Labor includes Employment Overview, Beyond U-3, Stable Work & Income, Labor & Productivity, Future AI Careers, and Methods & Sources. The population comparison includes employed people and active-duty military with matched source dates where available. The remainder is outside measured employment; it does not measure unpaid contribution or economic productivity. Future AI career ladders are illustrative role references, not forecasts of demand, compensation, or job availability.

## Evidence and data model

Public records carry stable identifiers, source links, geographic/entity scope, units, observation dates, retrieval times, evidence status, and relevant limitations. Source-specific dictionaries and adapters live in `lib/`.

| Source family | Examples | Interpretation boundary |
| --- | --- | --- |
| Health and research | ClinicalTrials.gov, PubMed, CDC/NCHS surveillance and surveys, NHSN, SSA, public clinical/company disclosures | Search windows, reporting coverage, study design, and U.S. versus multinational populations differ |
| Economy, labor, housing, and industry | BLS and Census series via FRED, BEA and other official releases, EIA, public filings and project disclosures | Stocks versus flows, seasonality, nominal versus real values, indexes versus transaction prices |
| Infrastructure and environment | Public energy, logistics, agriculture, NOAA space-weather and launch-catalog sources | Announced, funded, built, energized, operational, and utilized are distinct stages |
| Technology and international institutions | Primary standards, official legal/policy text, operator documentation, research tests, procurement and incident records | A specification, partnership, simulation, operational deployment, and sustained independent outcome require different evidence |

Connected adapters, manually reviewed records, and bundled dated snapshots are labeled separately. Failed refreshes retain the last valid data and expose stale/error states. Missing, zero, not applicable, and not disclosed must not be silently merged. No fictional telemetry or interpolated adoption history is used to fill gaps.

Source terms and redistribution rights still apply. Public availability does not guarantee unrestricted republication. Research and scenario views are not clinical, investment, or legal recommendations.

## Private workspace and persistence

Shared tools include evidence drawers and deep links, private notes, saved evidence, favorite pages, watchlists, search, comparison boards, saved views, backup/restore, and source-health inspection. Export formats vary by module; use each view's supported controls.

Production uses owner-private Sites access and ChatGPT identity. User workspace records are keyed to the authenticated user in D1. User workspace writes require a matching Origin. The maintenance endpoint has a separate platform-authenticated path for authorized public-source maintenance; it cannot edit private user workspace data.

Some specialist imports, scenarios, and configurations use browser-local storage. Those are labeled and do not automatically synchronize to D1. Export them before changing browsers or clearing storage. Current deployed Measurements reviews are append-only, and guarded workspace writes can reject conflicts; this is not a collaborative multi-user merge system.

Hosted databases, runtime secrets, permissions, cloud schedules, and private user records are **not included in a Git clone**. Do not commit credentials, private notes, telemetry, or database files.

## Refresh and scheduling

Public-source refresh follows adapter-specific cadence, caching, provenance, and failure handling. An HTTP success is not proof that every provider refreshed successfully; inspect stored source health.

The hosted application supports authorized maintenance and briefing schedules. These are external deployment resources and are not installed by cloning the repository. Page-local alert dry runs, browser-only watch settings, public-source maintenance, and external notifications are separate capabilities; a visible threshold does not imply background monitoring or message delivery.

The Long COVID Research Watchlist and Internet's Vint Cerf content are exempt from automatic updates. Read `.openai/refresh-instructions.md` before changing collection or maintenance behavior.

## Run locally

Requires **Node.js 22.13 or newer** and npm. From the repository root:

```sh
npm run install:ci
npm run build
```

For a fresh local database, initialize the schema once:

```sh
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_stale_wong.sql
npm run dev
```

Open the printed local URL, normally `http://127.0.0.1:5173/`. The portable profile provides loopback-only mock sign-in; production uses platform authentication. Local D1 is separate from hosted D1. Do not replay migrations against an already initialized database.

Use `.env.example` and the deployment configuration as references for optional integrations. Keep secrets server-side and out of the hosting manifest and Git history. Provider access and network availability may differ between local and hosted execution.

## Repository guide

| Path | Purpose |
| --- | --- |
| `app/command-center.tsx` | Shared dashboard shell, routing, workspace integration, and page composition |
| `app/*dashboard*`, other domain components | Specialist interfaces, charts, maps, and evidence views |
| `app/api/` | Authenticated data, refresh, workspace, and maintenance handlers |
| `lib/catalog.ts` | Page groups, subtabs, source catalog, and shared record types |
| `lib/` | Domain models, adapters, measurement definitions, source dictionaries, parsers, and dated snapshots |
| `db/`, `drizzle/` | D1/Drizzle schema and migrations |
| `scripts/` | Development/build wrappers, collection/import utilities, and operational checks |
| `tests/` | Domain logic, parsers, provenance, missing-data, history, and persistence tests |
| `public/` | Static assets and map resources |
| `.openai/hosting.json` | Retained Sites identity and deployment bindings |
| `.openai/refresh-instructions.md` | Maintenance authorization, exceptions, and source-health rules |
| `CLOUD_HANDOFF.md`, `AGENTS.md` | Continuation notes and repository working instructions; older dated notes may describe superseded states |

## Validation

For implementation changes, run TypeScript, relevant domain tests, and a production build:

```sh
node node_modules/typescript/bin/tsc --noEmit
node --test tests/calculations.test.mjs tests/changes.test.mjs tests/progress.test.mjs tests/progress-market-access.test.mjs
npm run build
```

With the local server running and database initialized:

```sh
node --test tests/workspace.test.mjs
```

Choose additional tests for the changed domain from `tests/`; some require fixtures, network access, or a running server. The workspace integration suite restores its original local test state. Do not run mutation tests against production.

The latest deployed Measurements/Progress update additionally passed its measurement and world-observation tests, including milestone gates, event deduplication, panel vintages, planned-versus-actual dates, and missing-versus-zero handling. Its UI was checked on desktop and mobile. Those new test files accompany the newer Sites source and will become runnable here when that source is synchronized.

## Publishing and portability

GitHub and Sites serve different purposes:

1. **GitHub:** versioned source, documentation, and review. Pushing this repository does not deploy the hosted dashboard.
2. **Sites:** retain the existing project identity, build the intended source, package that exact version, and publish through the supported Sites workflow. Preserve owner-private access.
3. **Migration:** export private workspace data separately, provision storage and authentication, reconnect permitted providers, and recreate authorized schedules. A source archive alone does not transfer these resources.

Before release, verify navigation and deep links, source scope/dates, missing and stale states, persistence, representative charts/maps, and desktop/mobile layouts. Do not restore intentionally removed cards or relabel a proposal, proxy, or scenario as an observed result.
