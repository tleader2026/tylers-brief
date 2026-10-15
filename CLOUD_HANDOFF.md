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
U.S. ASI Progress: Trust & Safety, Capabilities, Governance, Robotics.
U.S. ASI Markets: Labor, Companies, Market Signals, Supply Chains.
U.S. Global: Geopolitics, Economy, Internet.

Robotics is a new placeholder below Governance, ready for a later build-out. Population Health is nationally focused, with 10 subtabs after removal of Recovery & Research. It has source-backed metrics and honest placeholders. Repeated explanatory cards removed at the user's request must not be restored. Chronic Illness titles start with "Americans with". Health figures use red for adverse burden and green for health/participation/support; administrative changes do not imply recovery.

Companies are grouped into AI Pillars and AI Startups, ordered by positive operating income first, undisclosed profitability next, operating losses last. Consumer credit-card spending and effective federal funds rate charts use green-low/red-high. PCE prices and real disposable income sit together. Agriculture's Corn and Grain header is compact like Soil Status. Today subtitle: "The wider measure and macro metrics".

## Publishing and state

Use the Sites plugin workflow to synchronize, build, save, and deploy to the retained project when it is available. A GitHub push alone does not deploy this Sites app or transfer its database/scheduler credentials. Preserve owner-private access. The existing deployment continues operating independently of this repository.

Bundled snapshots and static assets are included. Hosted user notes, saved views, record revision history and cloud schedules must be exported/reconnected separately for a migration to another host. Do not make private user data public. No authentication token is included in this repository.

## Labor module

Labor has five national subtabs: Employment Overview, Beyond U-3, Stable Work & Income, Tech Hiring, Methods & Sources. My Career is intentionally omitted. Public BLS/FRED series begin in 2022; annual CPS occupation/desire tables are dated 2025 extracts with the missing-October caveat. Refresh uses labor-fred through the existing maintenance flow. `scripts/collect-labor.mjs` refreshes the bundled baseline. The historical broader-unemployment assertion is an owner-scoped runtime secret (`LABOR_ASSERTION_JSON`), excluded from source and public exports. No career history, compensation or application log is included. Missing person-level adequacy, ad histories and causal consequence datasets stay explicitly unavailable.

Trust & Safety is a placeholder page under U.S. ASI Progress, ready for a later build-out.

Trust & Safety is implemented locally with eight subtabs and a separate typed calculation module (`lib/trust-safety.ts`). It remains unpublished by explicit task instruction; do not mistake local implementation for the current live placeholder. See README local-build notes. Google estimate status is retained in the evidence ledger but omitted from the benchmark card. No operational telemetry is bundled or uploaded.

Publication correction: use a fresh archive filename for each source version and verify the live Trust & Safety route after deployment. Reusing a prior package path can upload a cached archive; the completed page must show its eight subtabs, not the placeholder.

Live verification remains required: the combined publisher reported successful versions 145–147 while the browser still loaded the placeholder. The local source and build were verified independently. Diagnose archive ingestion and deployed asset routing before treating publication metadata as proof of the page.

Verified live correction October 14, 2026: separate save_site_version with an uncompressed verified tar, followed by deploy_private_site_version, succeeded in live browser verification. Version 148 now shows all eight subtabs, the trust-safety-2026-10-14 marker, correct navigation order and the Google card without a status badge. The exact underlying cause of the earlier combined-publisher mismatch is unresolved.

Capabilities: implemented as the AI Capability & U.S. Continuity Observatory with eleven subtabs, independently sourced dated horizon fits, source/method drawers, explicit operational gaps, browser-local thesis and scenario edits, saved views and exports. Preserve unknown dates/budgets and the separation of models, products and evaluated systems. Do not label paused METR snapshots live or restored biological function established without appropriate evidence. The 2026-10-14 source checks are retrieval dates, not measurement dates. See README for dataset and persistence limits.


## Housing Smart Upgrades
National-housing Smart Upgrades includes weighted EIA RECS 2020 smart-thermostat household estimates, 60-replicate jackknife confidence intervals, state/income/housing/construction comparisons and the separate 2015 SMARTTHERM series (96 BRR/Fay replicates). Survey wording changed; no annual growth rate is inferred. Current device stock/activity, most category adoption, national costs and readiness/security coverage remain explicit data gaps. ENERGY STAR savings are benchmarks, not household outcomes. The payback calculator is an editable scenario. Optional device audit stores only in browser localStorage, rejects duplicate physical IDs, has no national extrapolation or cloud persistence. Reproduce the aggregate with scripts/aggregate-smart-upgrades.py and EIA public CSV/codebook inputs; do not bundle raw microdata. Reviewed 2026-10-14; review EIA 2024 heating release scheduled spring 2027.


## Tech Jobs and Labor navigation
Labor now belongs to U.S. Global and has Employment Overview, Beyond U-3, Stable Work & Income, Methods & Sources. Tech Hiring moved to the new Tech Jobs page under U.S. ASI Markets; old Labor Tech Hiring URLs redirect to /tech-jobs?tab=Tech+Hiring. Tech Jobs has Tech Hiring, Semiconductors, Big Tech, Startups, Data Centers, Sources & Methods. The moved content renders once. Nine new BLS/FRED series run through the existing labor-fred refresh adapter/API; tech series are excluded from Labor’s visible registry. Monthly JOLTS flows are NSA and broad industry context, never narrow-category totals. Company project jobs are separate current stocks, cumulative contributors or plans, never summed as monthly hires. Microsoft Wisconsin and Intel Ohio primary sources reviewed 2026-10-14. Category-specific U.S. hires/layoffs and startup counts remain explicit gaps. Retain full counts and removed Compensation and hiring outcomes tile.


Labor Employment Overview heading is Broader Employment Stress. The unemployed/employed/civilian-force/military standalone tiles and redundant two-line employment chart were replaced by LaborPopulationChart. Census POP all-age estimate is the blue baseline; CPS civilian series keep red/green/cream, military uses cream dashed with only three DMDC dates. Full counts and population-share views retain missing months. Shares are not unemployment rates or an additive partition. Future POP dates excluded; 2026 advance-published estimates explicitly labeled.


Thesis Lab & Scenarios is now under Governance, removed from Capabilities navigation. Legacy Capabilities thesis links redirect. The same CapabilityDashboard implementation and capability-observatory-v1 browser-storage key remain, preserving thesis edits, scenario inputs, configurations and saved views. Internal capabilityTabs indices stay stable for measurement metadata/backward compatibility; public navigation lives in lib/catalog.ts.

Healthcare Capacity (/healthcare-capacity) is under the broadened U.S. Health group. Nine subtabs combine CDC NHSN weekly jurisdiction data from November 2024, annual AHA stock, dated CES payroll, NRMP Match and KFF survey benchmarks, RECOVER allocation context and U.S.-site registry panels. No multinational enrollment is treated as U.S. enrollment. Reporting populations vary; bed-stock differences are not net openings. Watch settings are browser-local and do not send notifications. /api/healthcare-capacity refreshes CDC for the signed-in viewer with last-good baseline retained on failure. Rebuild the published snapshot with scripts/import-healthcare-capacity.mjs after updating its as-of date. Field completions, annual obligations, clinic waits, workforce Long COVID disability and claims remain explicit gaps.

## Timeline and section purposes (2026-10-14)
- Executive Summary: Timeline sits below Measurements with a clock icon. `/timeline` has What I think now and How my thinking evolved views. Theses now live here; Governance's former editor links to Timeline.
- Timeline ideas and append-only event histories live in private workspace `theses`, validated by `lib/thesis-timeline.ts` and included in workspace backup/restore. New events preserve previous statements; revisions increment versions, branches create linked ideas; lifecycle and evidence states are independent. No past reviews/tests are invented.
- First Timeline open imports existing seeded theses or valid browser-local `capability-observatory-v1` latest statements as Imported events. Unknown origin dates stay unknown. Legacy browser storage remains intact; duplicate legacy IDs are skipped. Existing server workspaces default to an empty theses array until migration.
- Preserve event history during maintenance. Untested, inconclusive, contradicted, and supported under conditions are distinct. Do not automatically revise personal theses.
- Design purposes: Measurements is forecasting; Market Signals is AI/ASI economics; Supply Chains is dependencies governing AI proliferation; Robotics is physical execution.

## Temporal graph redesign (2026-10-14)
Timeline now renders `app/temporal-workspace.tsx` with an SVG graph and recorded-time scrubber; the earlier card views are superseded. Private `timelineGraph` contains stable nodes, append-only full-snapshot events, versioned relationships and independent layout positions. Existing `theses` remain untouched and migrate once through `importIdeas`; no synthetic chronology or demo graph is installed.
- Nodes: thesis, observation, test, alternative explanation. Relations: Supports, Challenges, Tests, Revises, Depends on, Related to. Relations express recorded reasoning, never inferred causality.
- Playback is recorded time only. Occurrence, observation and publication dates remain separate/unknown allowed. `snapshotAt` filters nodes and edges; retired hidden unless enabled, reopened visible, source annotations and detail history filtered at playhead time. No confidence scores.
- Authoring is closed by default. Historical snapshots are read-only; dragging layout is independent. Planned tests may lack results. Existing dashboard source attachment copies dated references into the new snapshot rather than dynamically exposing future evidence.
- Workspace PUT uses X-Timeline-Revision plus atomic compare-and-set on workspace value, verifies existing graph events remain immutable, and retains graph when an old client omits it. Conflicts show errors; export before reload. Backup includes graph, positions and histories.
- Tests: `node --test tests/temporal-graph.test.mjs tests/thesis-timeline.test.mjs`. Preserve personal graph/history during maintenance; no automatic authoring.

## Timeline temporarily disabled (2026-10-14)
At the owner’s request, Timeline is hidden from navigation and direct `/timeline` visits redirect to Today. Do not re-enable without a new request. Implementation, thesis history, timelineGraph and saved positions remain preserved for future development; no data was deleted.

## Governance rebuild (2026-10-15)
Governance now uses `app/governance-dashboard.tsx` for Overview, Controls & Evaluations, Incidents, Continuity & Competition, Human Outcomes & Institutional Learning, and Policy tracker. The existing Thesis Lab & Scenarios route/component remains unchanged. Legacy Capability releases/Evaluations/Agent safety links resolve to Controls & Evaluations. Timeline stays disabled.
`lib/governance-registry.ts` defines all 12 independent priority families and separate statistical components plus secondary controls, full metric contracts, feasibility and collection plans. No national denominator or composite governance score is fabricated. Six overview measures remain unknown until compatible observed cohort data is connected. Aggregate observation JSON is validated (rates, dates, IDs, cohort/protocol compatibility), stored in authenticated workspace governanceObservations, included in workspace backups, and exportable.
`lib/governance-evidence.ts` pins primary sources and an eight-entry announcement ledger reviewed October 15. OpenAI Preparedness v2 is a pinned historical linked document, not assumed latest complete operating policy; September 2026 disclosures are separate. NIST RMF revision, Anthropic 3.4 history, METR paused TH 1.1 page and FMTI 2025 indicator breaks are explicit. Six initial OpenAI misalignment reports are a named company-reported corpus, not independent verification, national prevalence or a severe-incident count. Unknown dates/closure/affected populations remain unknown. Do not automatically count news articles as cases.
Governance adapter checks source availability and discovers Federal Register metadata. Availability does NOT revalidate document versions or implementation. News has dedicated governance-policy and governance-incidents queries. Manual news refresh forces retrieval; one governance page-open refresh runs when coverage is absent/old. Failures retain last-good records and show source health. No private telemetry collection or individual surveillance is enabled.
Checks: TypeScript/build plus `node --test tests/governance.test.mjs tests/news.test.mjs`.

Owner removal (2026-10-15): hide the Tested governance coverage family panel in Governance. Preserve its registry definitions and stored observations; do not restore the removed panel.

## Robotics first version (2026-10-15)
Robotics is now populated with nine tabs in app/robotics-dashboard.tsx. lib/robotics-data.ts pins primary public releases reviewed 2026-10-15: final IFR 2026 U.S. installations (38,400 in 2025; prefer final U.S. PDF over rounded global and preliminary figures), IFR cross-country 2025 totals, A3 North American orders, Census 2022 spending, BLS productivity/JOLTS, BMW pilot, NIST methods and NHTSA/Waymo scope. Public snapshots are manually reviewed, not live adapters. Detailed IFR/A3 data remain licensed. No state adoption map, national robotics score or inferred productive fleet is installed.
Useful output, accepted quality, total human support and observed unit economics remain separate. BMW components moved are not quality-accepted results or verified paid deployment. Conditions, assistance and denominators are required for imported cohorts. Operator observations and append-only thesis reviews use existing private manual evidence records; backup/restore already includes manual records. Do not overwrite imported IDs or automatically author personal beliefs. Timeline remains disabled.
Economics and continuity workbenches are illustrative, adjustable and exportable. Continuity allocates maintenance, then support, then manual labor, with fallback constrained by spare human hours and power/connectivity/vendor capacity. No scenario is historical evidence. Tests: node --test tests/robotics.test.mjs; run TypeScript and production build.

## AI Markets & Market Signals — 2026-10-15
Replaced /market-signals placeholder with six views for demand, capital economics, expectations, value capture and emerging markets. Source snapshots are in lib/ai-market-data.ts; accounting units and exact cohorts are preserved. No cross-stack revenue total or composite health score. Market observations and forecasts import into existing owner-private manual records, with confidential rows excluded from default view/export. No licensed feed, live quotes, measured retention/customer ROI or background alerts are implied. Models are explicitly illustrative. Test with node --test tests/ai-market.test.mjs and npx tsc --noEmit. Preserve Timeline hidden status and prior user removals.

Owner removal (2026-10-15): removed Robotics Deployment stages · cohort evidence panel. Preserve deployment-stage definitions and imported cohort records; do not restore the panel.

Owner layout (2026-10-15): International industrial installations · 2025 belongs on Robotics Overview, after The durability hypothesis, not Deployment & Diffusion.

Owner removal (2026-10-15): removed Robotics Operator evidence registry · task cohorts and Measurement gaps panels across all tabs. Preserve stored private observations and measurement definitions; do not restore panels.

Robotics reliability redesign (2026-10-15): removed Spartanburg pilot panel and Overview useful-output pilot card. Useful Output & Reliability now uses app/robotics-reliability.tsx and lib/robotics-reliability.ts for private daily fleet aggregates. No numeric Optimus telemetry is connected. Tesla public vehicle API is not an Optimus feed. Imports require mutually exclusive time states and non-overlapping cohort/day; weighted uptime and sample-weighted sensors retain missing values. Preserve prior registry/gap removals. Tests: robotics-reliability.test.mjs and robotics.test.mjs.

Owner removal (2026-10-15): removed Observed project economics panel from Robotics Economics; retain the economics workbench.

Owner navigation (2026-10-15): Robotics Economics is renamed Calculator and placed immediately after Thesis Testing. Underlying workbench is unchanged.

Owner removal (2026-10-15): removed Robotics Thesis Testing tab, its rendered panels and Overview link. Retain previously saved private thesis records. Calculator now follows Supply Dependencies.

Medical map styling (2026-10-15): uses shared trial-map-canvas sizing (480 desktop / 400 compact), same OSM basemap as Housing/Utilities, scale control and padded contiguous-US fit. ResizeObserver invalidates map geometry and fits the chosen region when visible/resized. Preserve medical colors, layer definitions and state selection.


## Drug Discovery (2026-10-15)
Added /drug-discovery under U.S. Health, after Medical Capacity, using the existing dashboard palette and navigation. Eight views cover overview, pipeline, clinical cohorts, speed/productivity, commercial validation, patient value, program timeline, and sources/methods. lib/drug-discovery-data.ts contains an explicitly selected eight-asset panel; it is not an industry census. lib/drug-trial-snapshot.json preserves seven ClinicalTrials.gov records retrieved October 15, including actual/estimated dates, endpoint hierarchy, countries and source updates. Registry starts and dosing disclosures are distinct. No live feed is claimed. Review registry monthly, financials quarterly, results at publication.
Clinical evidence separates primary comparative efficacy from safety, PK and uncontrolled/secondary signals. Discontinued assets remain. Baricitinib is a historical acute-COVID repurposing indication, not AI-designed or evidence for Long COVID. Rentosertib Phase III in China is distinct from published small Phase IIa results. Canonical asset identities prevent alias, license, multi-role and multi-trial double counting. Historical stage chart carries observed stages forward, retains Unknown before first observation and excludes forecasts; it is a retrospective fixed panel, not a complete historical census. Phase entry cohort proportions include unresolved cases and explicitly disclose unequal follow-up/selection bias. No industry success rate, growth, capital total or causal speedup is invented. Cash receipts, recognized revenue, triggered milestones and announced equity proceeds remain separate.
Verification: node --test tests/drug-discovery.test.mjs; npx tsc --noEmit; production build. Browser checks cover navigation, alias search, empty Long COVID filters, evidence/history expansion, empty clinical cohorts and commercial view. Preserve Timeline disabled and all prior owner removals.


## Exposure Risk multi-pathogen expansion (2026-10-15)
Exposure Risk now dispatches to app/exposure-risk.tsx for all three existing tabs. Shared threat query parameter controls map, national summary and regional charts. Six numerical CDC targets: SARS-CoV-2, influenza A (source label Influenza A virus), RSV, H5, wild-type measles, mpox (any tested assay; not clade-specific absence). Fourteen additional WastewaterSCAN panel selectors link to provider views; numerical feeds are explicitly unconnected. Ebola has an unavailable selector, never fabricated zero readings. Wastewater does not measure Long COVID prevalence or individual infection probability.
lib/wastewater-activity.ts isolates targets in IDs and aggregation, retaining legacy COVID IDs. lib/wastewater-detection.ts deduplicates sample/target by latest source update, groups Sunday–Saturday site weeks, and calculates any-positive sites / tested sites; unknown flags excluded. H5 animal sources and variable mpox clade assays are explicit. Latest detection weeks after the source update date are labeled partial. Activity history 26 weeks; detection history eight weeks. Additional values are not cross-pathogen comparable; missing/unconnected map states are gray. Source detail drawers use central merged snapshot records to preserve routing and exports.
lib/wastewater-adapter.ts pages CDC data and returns partial warnings per failing target; refresh retains last-good data. scripts/collect-wastewater.mjs collects fresh public data into lib/wastewater-multi-snapshot.json. Current October 15 retrieval: 2,780 series, all six targets, no collection warnings. Bundled records remain labeled VERIFIED SNAPSHOT until a successful runtime update. This is not an exhaustive global wastewater threat registry; WWSCAN external-only coverage must not be described as integrated. Existing raw SARS-CoV-2 adapter is preserved but its measurements are not mixed into the new normalized/detection views.
Checks: node --test tests/wastewater-activity.test.mjs tests/wastewater-threats.test.mjs; npx tsc --noEmit; production build. Browser checks: Flu A map, Ebola unavailable, H5 source drawer, RSV across Texas/Other States, norovirus provider link. Preserve all owner removals and disabled Timeline.

Owner removal (2026-10-15): removed the Market Signals Private research & structured evidence panel across its tabs. Preserve stored private observations, forecasts and workspace backup data; do not restore the import/template/export panel.

Owner removal (2026-10-15): removed Market Signals Material-change thresholds · on-page evaluation panel across all tabs. Retain previously stored rules; do not restore the panel.

Owner removal (2026-10-15): hide Explore historical observations on Market Signals Demand & Monetization only. The already removed threshold and private research panels remain removed across tabs.

Owner removal (2026-10-15): removed From funding to cash generation from Market Signals Capital & Infrastructure Economics. Do not restore the stages panel.

Owner removal (2026-10-15): removed External funding workbench from Capital & Infrastructure Economics; hide historical observations and source registry/backlog on that tab. Prior threshold/private research removals remain.

Owner layout (2026-10-15): Forecast versus actual · matched definition is the first content panel in Market Signals Wall Street Expectations, before dated research/guidance.

Owner wording (2026-10-15): all Drug Discovery overview metrics explicitly refer to AI-enabled discovery, design or repurposing. FDA approval and clinical efficacy do not certify AI performance or establish AI causation. Overview capital and cash/revenue now require AI-discovery-specific attribution and show unavailable; corporate Recursion figures remain context in Commercial Validation. Do not label company-wide financing or revenue as AI-discovery-attributable totals.

Owner removal (2026-10-15): historical AI-enabled pipeline by stage chart appears only in Drug Discovery Pipeline & Adoption; remove it from Overview.

Owner layout (2026-10-15): Internet evidence source-registry panel belongs at the very bottom of Vint Cerf, after the project directory and review footer. Other Internet tabs retain their existing evidence-panel placement. This requested layout change does not revoke the Vint Cerf scheduled-maintenance exemption.

Owner removal (2026-10-15): removed the Vint Cerf project & role directory introduction card and bibliography link. Keep individual project cards and bottom evidence panel.

Labor population visual (2026-10-15): added an all-age population-share callout and two 100% comparison bars above the history chart, with a 50% marker. Latest matched calendar month requires POP, CE16OV and CLF16OV; no denominator carry-forward. Counts are approximate cross-universe comparisons, not official BLS population partitions. Headline remainder means not counted in civilian employment, not unproductive. Civilian labor-force remainder is separate and includes active-duty personnel outside the civilian universe; no stale military count is subtracted. Official adult civilian participation is displayed separately when month matched. History defaults to population percentages, retains headcount mode and existing colors. Tests: labor-population-chart.test.mjs.

Owner removal (2026-10-15): removed the initiation-to-first-dose headline card from Drug Discovery Overview. Do not restore the card; retain underlying speed definitions.

Owner navigation (2026-10-15): Labor & Productivity moved from Robotics to Labor, immediately before Methods & Sources. Preserve its existing manufacturing productivity and labor-outcome panels/source details, rendered by the shared RoboticsDashboard branch with a Labor-specific heading. Robotics overview underlying-series links now point to Labor; old Robotics tab URLs redirect. No task/deployment filters appear on the moved tab because its national context is not filtered by them.

Future AI Careers (2026-10-15): new Labor sub-tab after Labor & Productivity, before Methods & Sources. lib/future-ai-careers.json preserves every provided field verbatim, 86 unique proposed roles across eight families. User brief says 92, but supplied table has only 86; do not invent six records. app/future-ai-careers.tsx is an owner-supplied illustrative reference, not openings/demand evidence; ASI titles are prospective. Search intersects all three filters; sortable five-column table defaults to family grouping and specified seniority. Specialist roles retain unspecified seniority and follow each family's ladder. Reset restores complete data and default ordering. Sticky headers and horizontal overflow preserve all columns. No external feed, salary, demand, adoption or job-count metrics. Tests: future-ai-careers.test.mjs; TypeScript/build; browser filter, reset, sort and navigation QA.
