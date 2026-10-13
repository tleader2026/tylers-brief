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
