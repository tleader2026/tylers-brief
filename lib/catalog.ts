export const pages = [
 ['today','Overview / Today','Workspace','Today'], ['research','Long COVID Research','Health','Research'], ['trials','Clinical Trials','Health','Trials'], ['wastewater','COVID & Wastewater','Health','Wastewater'],
 ['local-housing','Bastrop & Central Texas Housing','Housing & Local','Local housing'], ['national-housing','National Housing','Housing & Local','National housing'], ['infrastructure','Texas Infrastructure & Community','Housing & Local','Infrastructure'],
 ['companies','AI Companies & Markets','AI & Markets','Companies & markets'], ['governance','AI Governance & Capabilities','AI & Markets','Governance & capabilities'], ['geopolitics','Geopolitics','World & Economy','Geopolitics'], ['economy','U.S. Economy & Purchasing Power','World & Economy','Economy'],
 ['connections','Cross-Domain Signals','Workspace','Connections'], ['library','Research Library & Notebook','Workspace','Library & notebook'], ['alerts','Alerts & Briefings','Workspace','Alerts & briefings'], ['settings','Sources, Data Health & Settings','Workspace','Sources & settings'],
] as const;
export const tabs: Record<string,string[]> = {
 research:['Treatment landscape','Mechanisms','Biomarkers','Publications','Drug development'], trials:['Top 10','Registry','Map','Calendar','Changes'], wastewater:['Local trends','Texas','National','Coverage map','Methods'],
 'local-housing':['Market trends','Comparable sales','Listings','Affordability','Property opportunities'], 'national-housing':['Market trends','Regional comparison','Affordability'], companies:['Company landscape','Public markets','Products & adoption','Infrastructure','Bubble indicators'],
 governance:['Policy tracker','Capability releases','Evaluations','Agent safety','Incidents'], geopolitics:['Active conflicts','Strategic competition','Adversarial signals','Economic exposure','Timeline'], economy:['Macro health','Purchasing power','Labor','Inflation','Credit stress','AI investment exposure'], infrastructure:['Projects','Map','Timeline','Civic notebook'], alerts:['Alert rules','Daily brief','Weekly synthesis','Ensitrelvir review'],
 };
export type RecordData = {id:string;domain:string;title:string;provider:string;url:string;scope:string;units?:string;date:string;published?:string;retrieved:string;status:string;summary:string;details?:any;series?:{date:string;value:number|null}[];value?:number|null;change?:any;kind:string};
export const sources = [
 {id:'trials',name:'ClinicalTrials.gov',domain:'trials',url:'https://clinicaltrials.gov/data-api/api',mode:'adapter',cadence:'Daily',coverage:'Registry metadata; global; sites as listed'},
 {id:'pubmed',name:'PubMed / NCBI',domain:'research',url:'https://www.ncbi.nlm.nih.gov/books/NBK25501/',mode:'adapter',cadence:'Daily',coverage:'Published Long COVID literature; abstracts when provided'},
 {id:'fred',name:'FRED / Federal Reserve Bank of St. Louis',domain:'economy',url:'https://fred.stlouisfed.org/',mode:'adapter',cadence:'Daily cache; observation cadence varies',coverage:'U.S. macro and housing series; no Bastrop sale prices'},
 {id:'cdc',name:'CDC National Wastewater Surveillance',domain:'wastewater',url:'https://data.cdc.gov/Public-Health-Surveillance/CDC-Wastewater-Data-for-SARS-CoV-2/j9g8-acpt',mode:'adapter',cadence:'Weekly',coverage:'Raw Texas site concentration; county service areas retained, not statewide aggregate'},
 {id:'sec',name:'SEC EDGAR',domain:'companies',url:'https://www.sec.gov/edgar/search/',mode:'manual',cadence:'On filing',coverage:'Public-company filings; automated access needs identified contact'},
 {id:'bastrop',name:'Bastrop Central Appraisal District',domain:'local-housing',url:'https://bastropcad.org/',mode:'manual',cadence:'Annual / records as posted',coverage:'Appraisal records, not verified closed sale prices'},
 {id:'fhfa',name:'FHFA House Price Index',domain:'national-housing',url:'https://www.fhfa.gov/data/hpi',mode:'manual',cadence:'Monthly / quarterly',coverage:'FRED USSTHPI connected separately'},
 {id:'recover',name:'NIH RECOVER',domain:'research',url:'https://recovercovid.org/',mode:'manual',cadence:'As published',coverage:'Program publications and trial announcements'},
 {id:'fda',name:'FDA',domain:'research',url:'https://www.fda.gov/',mode:'manual',cadence:'As published',coverage:'Regulatory decisions; not automatic ingestion'},
 {id:'policy',name:'Official policy texts',domain:'governance',url:'https://www.congress.gov/',mode:'manual',cadence:'As published',coverage:'Add verified records with jurisdiction and legal status'},
 {id:'local',name:'Bastrop County public records',domain:'infrastructure',url:'https://www.co.bastrop.tx.us/',mode:'manual',cadence:'As posted',coverage:'Meetings, permits and documents; manually curated'},
 {id:'world',name:'UN news and official documents',domain:'geopolitics',url:'https://news.un.org/',mode:'manual',cadence:'As published',coverage:'Official reporting; corroboration requires separate evidence'},
 ];
export const seriesConfig = [
 ['CPIAUCSL','Consumer price index','economy','Index, 1982–84 = 100','U.S.; seasonally adjusted'], ['PCEPI','Personal consumption expenditure prices','economy','Index, 2017 = 100','U.S.; seasonally adjusted'], ['UNRATE','Unemployment rate','economy','Percent','U.S.; seasonally adjusted'], ['FEDFUNDS','Effective federal funds rate','economy','Percent','U.S.; monthly'], ['MORTGAGE30US','30-year fixed mortgage rate','local-housing','Percent','U.S.; weekly mortgage survey'], ['USSTHPI','U.S. house price index','national-housing','Index, 1980 Q1 = 100','U.S.; quarterly; all-transactions'], ['TXSTHPI','Texas house price index','national-housing','Index, 1980 Q1 = 100','Texas; quarterly; all-transactions'], ['DSPIC96','Real disposable personal income','economy','Billions of chained 2017 dollars','U.S.; seasonally adjusted annual rate'],
 ] as const;

