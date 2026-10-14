# Tyler's Brief unattended maintenance

This Site is owner-private. Preserve that audience, user notes, saved items,
Watchlist priorities and personal assessments, profile photo, theme and layout.
The owner authorizes updating every data source and tile, including future additions,
EXCEPT the Long COVID Research Watchlist and the Internet Vint Cerf tab. Both
are explicitly exempt from automatic updates and refresh warnings. Leave their
content unchanged during scheduled maintenance.
Never fabricate values or silently replace a failed feed with a healthy snapshot.

## Access and persisted health

Read the linked Site with Sites get_site; obtain its supported service access
token from that response. Send it only to the returned current_live_url in
`OAI-Sites-Authorization: Bearer <token>`. Do not store or print credentials.
Sites dispatch protects the shared maintenance endpoint; it deliberately does
not require a visitor identity. It cannot edit user-owned workspace data.
If access is unavailable, report the failure; do not change the audience.

1. POST `/api/maintenance` JSON `{"action":"begin","scope":"weekly"}`
   (or scope `news`). This leaves interrupted/unverified sources red.
2. POST JSON `{"action":"refresh","scope":"weekly"}` (or `news`).
   This bypasses caches and persists adapter records and source health to D1.
3. GET `/api/maintenance` and inspect every result. A 200 response is not proof
   that every adapter succeeded. Retry failed adapters once; retain last good data.
   If the hosted adapter is blocked upstream, run the same source adapter/parser
   from the cloud task environment. Fetch its documented public URLs directly
   (a failed browser session is not proof the source is unavailable). Use the
   tracked scripts/refresh-live.mjs fallback for news and fred first (one hidden
   stdin JSON line with origin, supported token and scope; no credentials on disk),
   then the source parsers in lib/news.ts, lib/geopolitics.ts, lib/internet-feed.ts or the
   FRED CSV mapping in lib/ingest.ts. Preserve provenance and missing values.
   Persist validated live records with POST JSON {"action":"ingest",
   "provider":"news","records":[...],"warnings":[...]}. Supported providers:
   news, fred, trials, pubmed, cdc, cdc-wval, worldmonitor. Never ingest dated
   fallback snapshots as healthy live records. Include warnings for every failed
   topic/series so partial coverage remains red. Read back the persisted health.
   If external retrieval also fails, persist an error report and retain old data.
4. For weekly work, open the linked source repository using the Sites skill's
   source workflow. Read all data components, source URLs and snapshots anew,
   including additions since this checklist. Review every source below.
5. Persist reviewed-source health using POST JSON `{"action":"report",
   "reports":[{"key":"zillow","status":"connected","message":"Latest
   release verified; source observation date ...", "observationDate":"...",
   "evidence":["https://official-source-url"]}]}`.
   Use `error` or `partial` for failed, unconnected, incomplete or unverified
   sources, with a concrete reason. Connected requires comparing the actual
   latest published data against the displayed data, not just a reachable URL.
   A source with no new release may be connected after that comparison; retain
   its actual observation date. Never mark all groups green by assumption.
6. GET health again to confirm persisted attempts/statuses. Read relevant live
   pages/data to verify the write. If updating a bundled snapshot or component,
   validate it, build, push and publish privately through Sites; do not merely
   change retrieval timestamps. Normal adapter updates need no deployment.

New navigation-only sections listed in lib/catalog.ts unpopulatedPages are empty
by the owner’s instruction. Do not populate them during maintenance or flag their
intentional empty state as a refresh failure. Once separately populated, include
their data sources in subsequent refreshes.

## Weekly source checklist

The endpoint returns the complete known health group registry. Record a result
for **every group**, and register newly introduced source groups in
lib/refresh-health.ts. Add explicit `data-refresh-sources` to new tiles where
page dependencies would be too broad. Missing verification and overdue checks
automatically show a red tile icon. A red icon's tooltip/click explains the fault.

- trials, pubmed, fred, cdc, cdc-wval, news, worldmonitor: existing live adapters
  in lib/ingest.ts. Inspect partial warnings per series/topic and snapshots.
  Verify newest available releases; preserve units, missing values and evidence.
- governance: review all source-linked policy, capability and incident records,
  including manual records. Missing live coverage must remain red.
- reventure: verify authorized public housing data access; a working source link
  alone is not a connected data feed. Retain an error if it cannot supply data.
- Logistics: tracked scripts/collect-logistics.mjs collects BTS freight/modal
  history, government-origin BLS/EIA series through FRED, latest-vintage NY Fed
  GSCPI, Los Angeles port histories, and three tracked MARAD active advisories.
  Run its --persist mode with supported Site service access on hidden stdin to
  update D1 without deploying; read back health. The hosted weekly adapters also
  run these sources. Preserve null observations, units and periods; never mistake
  a monthly-data publication lag for a current streaming measurement.
  Review lib/logistics-reports.ts against the newest public AAR release, including
  its selected commodity figures and source dates, and latest EIA structural
  exposure publications. Write updated records/metadata with matching source
  links or update the bundled report source and publish. Never attach a newer
  report date to old commodity values. Update records' details.commodities too.
  Keep logistics-unavailable in error while paid spot rates, reliability,
  congestion, actual trucking utilization, domestic incident feeds and corridor
  input shares lack authorized verified integrations; explain the missing feeds.
  AAR full datasets need licensing; do not claim paid access. Use government
  public-domain datasets with citations, and retain source-specific reuse terms.
- companies: lib/company-reports.ts and app/company-dashboard.tsx. Review all
  seven companies' latest earnings, financial disclosures and attributed public
  revenue claims. Distinguish annual revenue, run rate, estimates and forecasts.
- ai-growth: lib/ai-growth.ts. Review Gartner, Forrester, Accenture and other
  macro adoption evidence; preserve survey populations and forecast labels.
- bubble: lib/bubble-risk.ts. Update inputs and recompute existing methodology;
  distinguish inference from reported facts. Do not copy another site's score.
- property: lib/property-history.ts, Bastrop public property tax assessments.
  Check latest assessment year for the existing property. An annual series need
  not change weekly; verify the current record and retain real historical years.
- housing: lib/housing-map-snapshot.json. Latest FHFA state indices, matched
  quarterly periods, year-over-year changes and map colors. Never invent values.
- zillow: lib/state-home-values.json. All 50 states and DC low/mid/high ZHVI tiers;
  use latest common month across the three listed official CSVs. Reventure is a
  source link unless authorized public data is actually available; flag gaps.
- water/electricity: lib/infrastructure-snapshot.json. USGS state use and partial
  consumption estimates, Texas and California reservoirs, EIA annual retail
  sales and latest EIA-860M construction inventory. Missing reservoir states are
  missing coverage, not zero or healthy national coverage. Keep partial errors.
- centers/av: lib/infrastructure-reports.ts. Latest CBRE/announced construction,
  regulator permissions and each AV company's disclosed fleet, miles and cities.
  Do not sum incompatible mileage periods or treat targets as deployed fleets.
- space: app/space-infrastructure.tsx. Starlink/OneWeb coverage and Starcloud
  progress using official statements; distinguish launches, plans and milestones.
- internet: lib/internet-research.ts, lib/internet-news-snapshot.json and Internet
  Society RSS. Refresh news snapshot, provenance and space papers; exclude the
  Vint Cerf tab and its project/role directory from scheduled updates;
  retain uncertainty about unverified papers and the non-exhaustive project list.
- ipv6: lib/ipv6-snapshot.json. Official Google adoption data, real daily dates;
  percent adoption is not address-space consumption. Preserve capacity definitions.
- research: the Long COVID Research Watchlist is EXEMPT. Do not update or
  verify its contents as part of scheduled maintenance; do not report it as stale.
- assets: verify public/us-states.json, county centroids, profile image and all
  locally referenced files plus externally loaded map assets. Repair broken
  assets; preserve unchanged static assets. Report unavailable map/data coverage.

All data sections should retain source attribution, actual publication/observation
dates and verification times separately. Update stale explanatory labels saying
background updates are disabled when those sections have actually been verified.
If a source cannot be updated, leave its last good data and persist its failure.
Notify the owner of actionable failures or important changes; stay quiet otherwise.

## Twice-daily news task

Only begin/refresh scope news and read back news health and persisted records.
The existing news adapter covers the owner's interests; do not regenerate fake
headlines, remove sourcing, or republish the dashboard for an ordinary feed refresh.
Partial feed/topic failure must remain red with available articles retained.

Company page descriptive summary cards (Company health, Company momentum, AI revenue) are static explanations, marked data-refresh-static. Exempt these three cards from scheduled data updates and refresh warnings. Continue updating the actual company reports and metrics below them.

Daily market close procedure: Only refresh market-volatility, market-etfs and market-options using POST /api/maintenance {action:refresh,scope:market}, then GET readback. Official Cboe histories can update on different dates: always align sessions for VXN minus VIX. Use scripts/collect-market.mjs with hidden service-access JSON if Worker source retrieval fails. Keep previous values and mark failed sources red. No fabricated history or broad put/call substitutions. Alpha Vantage server secret ALPHA_VANTAGE_API_KEY requires authorized adjusted daily and historical-options entitlements. ETF data uses split-adjusted closes/volumes, not dividend-adjusted inverse-fund price jumps. SQQQ velocity is daily percent change, volume surge compares preceding 20 sessions. SMH/QQQ is price relative strength, not advance-decline breadth. QQQ puts/calls measures volume across provider-reported contracts, not open interest or protective purchase intent. Source delay and observation date remain visible. Five-session history skips nontrading days; the same latest published close on a holiday is not a new session. Preserve owner-private access and never print/save keys.

Agriculture weekly procedure: refresh agriculture-prices, agriculture-drought, agriculture-progress, agriculture-wasde, agriculture-water, agriculture-income and agriculture-biosecurity through POST /api/maintenance {action:refresh,scope:agriculture}, then GET readback. If Worker upstream access fails, use scripts/collect-agriculture.mjs --persist with hidden service-access JSON. It collects original public sources and persists per-provider records without republishing. Inspect the latest actual NASS repository release date and do not assert a newer expected report is present. Retain last good data and red errors on parser/access failures. Keep seasonal progress, missing NA cells, dash-as-zero semantics, cumulative drought categories and same-market-year WASDE revisions. WASDE annual livestock projections are not monthly realized output or inventory. USDM land area is not cropland weighted; Texas storage is not property soil moisture or irrigation allocation. APHIS announcements are confirmed dated animal reports, not complete outbreak counts, current clearance status, human-health emergencies or quantified national output losses. Keep agriculture-unavailable marked error for absent crop-weighted drought, monthly realized livestock/inventories, full APHIS/trade feeds, local irrigation, import dependency and processing concentration. Existing Watchlist, Vint Cerf and static descriptive-card exemptions remain.

Space Systems weekly procedure: refresh space-weather, space-launches, space-missions, space-infrastructure, space-environment, space-milestones and space-context via POST /api/maintenance {action:refresh,scope:space}, then GET readback. Use scripts/collect-space.mjs --persist with hidden service access if Worker retrieval fails. Catalog free tier is 15 calls/hour; cache responses, honor throttling, never use the stale development API as live data. Require complete query pagination before cadence calculations; site country is distinct from provider nationality. Success denotes catalog target-orbit insertion, not mission completion or landing/reuse. NASA schedule human precision overrides placeholder machine timestamps; broad NET periods remain announcements. Review new original mission milestones and replace/extend the current Crew-13 verification scope when warranted. NAVCEN notices can be future forecasts or summaries of closed windows, not active outages. ESA 2026 annual baseline covers through end-2025: review subsequent official editions rather than shifting its cutoff. Review program/ownership descriptions in lib/space-context.ts using original disclosures and update source dates/status when the documented state changes. Never fabricate satellite census, outages, collision odds, classified telemetry, prices, valuations or backlog. Report space-unavailable as error for missing feeds. Weather observation freshness is hours, not a week; the open page refreshes NOAA with an hourly cache, and stale data remains labeled while closed. Preserve all existing exemptions and private sharing.

Company Landscape now covers eight AI Pillars (Google, Anthropic, Meta, Oracle, OpenAI, Microsoft, xAI, Palantir) and five AI Startups (Perplexity, Cursor, Scale AI, Abridge, Harvey). Review all at one as-of date, prefer June 2026 calendar-quarter public results or successor quarters, retain each metric actual observation period. Original analyst estimates must remain attributed, annualized pace/ARR separate from booked revenue, and dated historical private revenue never relabeled current. Verify original agency/company reports and public estimates; no paid access fabricated. Amazon remains in underlying records but is not in the requested landscape groups.

Weekly Snapshot energy tiles use FRED DCOILWTICO (WTI Cushing daily spot), GASDESW (weekly national on-highway diesel), GASREGW (weekly regular retail gasoline including taxes), and APU000072610 (monthly BLS household electricity U.S. city average). Include all four in weekly FRED refresh; preserve native frequencies and observation dates. Electricity is a household city-average benchmark, not all-sector EIA revenue per kWh. Initial five-observation snapshots must not be called live.


Population Health & Human Capacity weekly procedure: populate and verify population-chronic, population-work, population-benefits, population-function, population-mortality, population-longcovid, population-children and population-respiratory via /api/maintenance {action:refresh,scope:population-health} or the full weekly refresh. If Worker retrieval fails, use scripts/collect-population-health.mjs --persist with hidden access JSON. Register actual successful records; never upgrade a bundled dated fallback to live success. Inspect current CDC/NCHS annual products and comparable definitions; the fixed BRFSS 2013–2023, pain 2023, ME/CFS 2021–2022, Long COVID 2023 and NVSS 2024 report URLs remain historical evidence until replaced by a reviewed compatible newer edition. BLS release URL updates annually; parser preserves source year and shutdown caveat. SSA monthly counts preserve stock/flow distinctions and no return-to-work/permanence claim. CDC NREVSS/NSSP are weekly public national feeds. Population Health is nationally focused; do not add Texas/Bastrop metrics or local drilldowns. No all-cause acute illness count, no standardized-prevalence-to-headcount conversion, no cross-survey residual or additive disease count. Keep population-unavailable marked error/research gap for placeholders; the user requests placeholders without source questions. Preserve raw cells, weighted universes, published CIs, source dates and history. Review Sources & Methods export for the dictionary and missing integrations. Watchlist and Vint Cerf exemptions remain.

Internet monitoring additions: review lib/internet-monitor.ts source registry during weekly maintenance. Preserve dated ITU report vintage, version-pinned specifications and exact source methods. New unavailable metrics are source-review gaps, not healthy feeds or zero. No automatic numerical integration is claimed for RIPE/FCC/APNIC/provenance/agent/orbital test panels. Vint Cerf remains exempt from mandatory refresh. Retain all existing Internet content. Scenarios are user-defined assumptions; provenance inspector checks documentation only.

GOOGL stock tile replaces Today tech put/call. Refresh market-stock with the existing daily-close market scope. Public Nasdaq Close/Last endpoint; lib/google-stock.ts validates symbol, sessions and values. Preserve date, USD/share units, source and unadjusted-close limitations. Source failure retains the last good close and shows stale/error; no invented sessions. The initial fallback is a dated source snapshot, not a live quote.

## Labor

Refresh labor-fred (39 BLS CPS/CES/JOLTS series through FRED, since 2022) during weekly source maintenance. Retain seasonal adjustment and native cadence. Compare the pinned 2025 CPS table 11, 25 and 35 extracts in lib/labor-annual.ts with original tables before updating them; preserve the 11-month 2025 caveat. No automatic interpolation, inadequacy union or causal inference. Private runtime assertion values are not public data and must not be exported or changed by maintenance. My Career was explicitly omitted.

Military Labor: review the official DMDC Strength Summary linked in lib/military-labor.ts during weekly source verification. The pinned July 31, 2026 headcount includes DoD active duty plus Coast Guard. Update only after validating all service rows and totals against the current report, archive the dated report, preserve native reference dates and keep military personnel separate from CPS civilian denominators.

- housing-smart: Review Housing Smart Upgrades EIA RECS release schedule and public microdata, ENERGY STAR thermostat savings, CSA Matter documentation and vendor retirement notices. Preserve 2015/2020 native dates and survey-method differences. Rebuild aggregates only from verified public files using scripts/aggregate-smart-upgrades.py. Most footprint, category, security and readiness metrics remain unconnected; report partial, not healthy live telemetry. Optional browser-local inventories and scenario inputs are not national source data.

- Tech Jobs: labor-fred now also covers CES3133440001, CES5051800001, CES2023620001 and JTU3000/5100/2300 HIL/LDL pairs. Preserve NSA turnover, broad-industry labels and unknown narrow-sector counts. Review Microsoft Wisconsin/Intel Ohio project statements separately; employment stocks, cumulative workers and projections cannot be changed into realized hires. Tech Hiring is no longer on Labor.

- Labor population chart: refresh Census POP through labor-fred, keeping all-age/overseas and advance-estimate definitions. Source-published future months are excluded. Military stays only at DMDC report dates; never interpolate or carry forward unavailable months. Civilian/military/population lines are overlapping universes, not an additive total.

Healthcare Capacity: verify CDC NHSN mpgq-jmmr publicly and rebuild lib/healthcare-capacity-snapshot.json using scripts/import-healthcare-capacity.mjs after updating the as-of cutoff. Review CDC reporting era and coverage before inferring changes. Verify AHA annual stock, BLS CES6562000101, KFF firm-size universe, NRMP Match and dated RECOVER resource announcements separately. No annual obligations, clinic waits, healthcare-specific Long COVID absence or claims should be invented. The page displays its own baseline/retrieval/error labels; generic data-refresh-static annotations suppress the unrelated generic badge decorator, not authorization to maintain these metrics. Watchlist and Vint Cerf exceptions remain unchanged.
