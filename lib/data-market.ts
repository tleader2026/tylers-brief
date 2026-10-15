export const dataMarketReviewed='2026-10-15';
export const dataMarketSources={
 edm:{name:'EC / IDC · European Data Market, first report',url:'https://ec.europa.eu/newsroom/repository/document/2025-13/EDM_2024__2026__First_Report_on_Facts_and_Figures_9cU0iIjcuSZhjmwI9TchwqenidQ_114043.pdf',vintage:'2025 first report · Table 78, printed p.194',limit:'Broad modeled data-products/services market, including enabling components. Historical estimate; a second report is listed but its values were not verified. Not a valuation of all data assets.'},
 snow:{name:'Snowflake · marketplace provider receipts',url:'https://www.snowflake.com/en/blog/snowflake-marketplace-agentic-ai-growth/',vintage:'Published 2026-06-30',limit:'Internal platform records; includes data, apps and other offerings. Provider receipts are not Snowflake revenue. Receipts and transaction counts have different period endpoints.'},
 catalog:{name:'Snowflake · dated marketplace catalog',url:'https://www.snowflake.com/en/product/features/marketplace/',vintage:'Snapshot 2025-07-31',limit:'Lower bounds; mixed data, agents and SaaS listings. Listings are not paid products or unique contracts.'},
 catalogPrior:{name:'Snowflake · earlier catalog snapshot',url:'https://www.snowflake.com/en/lp/essential-apps-ai-data-products/',vintage:'Snapshot 2025-04-30',limit:'3,000+ listings and 750+ providers; threshold snapshots cannot establish exact growth.'},
 reddit:{name:'Reddit · S-1/A',url:'https://d18rn0p25nwr6d.cloudfront.net/CIK-0001713445/0c0ad8fc-352a-465a-af58-95f2e6619e70.pdf',vintage:'Filed 2024-03-15 · p.103',limit:'January 2024 aggregate data-licensing arrangements over 2–3 years. Historical signed value; not annual revenue, current backlog, or one buyer’s contract.'},
 cme:{name:'CME Group · FY2025 Form 10-K',url:'https://www.sec.gov/Archives/edgar/data/1156375/000115637526000009/cme-20251231.htm',vintage:'FY2025 audited reporting',limit:'Market data and information services revenue; includes non-AI financial data use. One issuer, not total market size.'},
 bitol:{name:'Bitol · standards adoption report',url:'https://bitol.io/bitol-graduates/',vintage:'Published 2026-07-28 · study ends May 2026',limit:'Self-reported ODCS and ODPS ecosystem adoption combined. Organizations can include proofs of concept; not contract volume or representative industry penetration.'},
 vercel:{name:'Vercel · September 2026 AI Gateway Production Index',url:'https://vercel.com/blog/ai-gateway-production-index-september-2026',vintage:'Published 2026-09-17 · observations through August',limit:'Aggregate gateway token usage, not organization adoption prevalence. September classification vintage only; earlier reports use different definitions.'},
 osi:{name:'OSI · Open Source AI Definition',url:'https://opensource.org/ai/open-source-ai-definition',vintage:'Definition reference',limit:'Public weights alone do not establish Open Source AI compliance.'}
} as const;
export type DataSource=keyof typeof dataMarketSources;
export type DataMetric={id:string;title:string;value:number;display:string;period:string;scope:string;type:'Estimate'|'Observed'|'Lower bound'|'Contract value'|'Adoption proxy';detail:string;change:string;source:DataSource};
export const dataMetrics:DataMetric[]=[
 {id:'us-market',title:'U.S. data-market value',value:403954,display:'€403.95B',period:'2024 · 2025 report vintage',scope:'United States · broad data products & services',type:'Estimate',detail:'Modeled annual market value; retained in the report’s euros. AI-only share and global total are not established.',change:'+18.7% vs 2023 estimate',source:'edm'},
 {id:'provider-receipts',title:'Data marketplace provider receipts',value:100,display:'>$100M',period:'2026-01-01 → 2026-06-16',scope:'Snowflake Marketplace · global',type:'Lower bound',detail:'Amounts paid to providers across data, apps and services; not platform revenue or data-only sales.',change:'Reported +277% year over year',source:'snow'},
 {id:'transactions',title:'Marketplace exchange activity',value:1700,display:'>1,700',period:'January–June 2026',scope:'Snowflake Marketplace · transactions',type:'Lower bound',detail:'Transaction events, not distinct buyers, datasets, or licensing agreements. Not divided into the receipts total.',change:'Prior comparable count not disclosed',source:'snow'},
 {id:'listings',title:'Productized marketplace offerings',value:3400,display:'3,400+',period:'2025-07-31',scope:'Snowflake · catalog listings',type:'Lower bound',detail:'Mixed data, agents and SaaS catalog. Publication does not demonstrate purchases or revenue.',change:'Earlier snapshot: 3,000+ · 2025-04-30',source:'catalog'},
 {id:'providers',title:'Data-product supply ecosystem',value:820,display:'820+',period:'2025-07-31',scope:'Snowflake · marketplace providers',type:'Lower bound',detail:'Providers can publish several product types. Exact supplier growth cannot be calculated from lower bounds.',change:'Earlier snapshot: 750+ · 2025-04-30',source:'catalog'},
 {id:'licensing',title:'Signed commercial data licenses',value:203,display:'$203M',period:'Agreements signed January 2024',scope:'Reddit · aggregate contract value',type:'Contract value',detail:'Multi-year data-access licensing arrangements. Terms span 2–3 years; not annualized revenue or current AI-market total.',change:'Historical disclosed agreement cohort',source:'reddit'},
 {id:'data-revenue',title:'Recognized data-product revenue',value:803.1,display:'$803.1M',period:'FY2025',scope:'CME · market data & information services',type:'Observed',detail:'Commercial data monetization benchmark, including non-AI uses. FY2024 revenue was $710.2M.',change:'+13.1% year over year · calculated',source:'cme'},
 {id:'standards',title:'Data-contract / product standards adoption',value:114,display:'114 orgs',period:'Study ending May 2026',scope:'Bitol · ODCS + ODPS ecosystem',type:'Adoption proxy',detail:'Technical schema, quality and product metadata standards; distinct from commercial licensing agreements.',change:'9 → 114 organizations over 14 months',source:'bitol'}
];
export const modelUsage=[
 {month:'2025-12',open:7,closed:93},
 {month:'2026-04',open:13,closed:87},
 {month:'2026-08',open:56,closed:44}
];
export const marketComparisons=[
 {region:'United States',prior:340416,current:403954},
 {region:'EU27',prior:82087,current:90036},
 {region:'China',prior:49422,current:68157},
 {region:'Japan',prior:54026,current:65703},
 {region:'Brazil',prior:11005,current:12682},
 {region:'Israel',prior:2994,current:3303}
];
export function exactGrowth(prior:number,current:number){return prior>0?(current/prior-1)*100:null;}
export const productizationMetrics=[
 {name:'Paid product conversion',formula:'Products with ≥1 paid buyer ÷ available products',unit:'% · same platform / period',status:'Not disclosed',reason:'Mixed free/paid catalog; a listing count alone cannot supply this rate.'},
 {name:'Recurring data-license retention',formula:'Renewed expiring agreements ÷ eligible agreements',unit:'% · renewal cohort',status:'Not disclosed',reason:'Public signed values lack the eligible renewal denominator.'},
 {name:'Technical contract coverage',formula:'Production data products with validated contracts ÷ active production products',unit:'% · defined estate',status:'Not measured',reason:'The standards register counts organizations, not their contracted products.'},
 {name:'Data-contract reliability',formula:'Successful scheduled schema / quality / freshness checks ÷ scheduled checks',unit:'% · same estate / window',status:'Not measured',reason:'No operational validation or SLA telemetry connected.'}
];
