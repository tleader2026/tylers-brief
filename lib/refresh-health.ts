export const refreshGroups = {
 'market-volatility':'Closing volatility indices','market-etfs':'Closing ETF prices and volume','market-options':'QQQ options volume',
 'logistics-bts':'Freight / modal activity','logistics-fred':'Freight fuel and service costs','logistics-gscpi':'Global supply pressure','logistics-port':'Port throughput','logistics-marad':'Maritime advisories','logistics-reports':'Public rail reports','logistics-exposure':'Structural logistics exposure','logistics-unavailable':'Unconnected logistics feeds',news:'News',trials:'Clinical trials',pubmed:'Research publications',fred:'Economic and housing series',cdc:'Raw wastewater', 'cdc-wval':'Wastewater activity',worldmonitor:'Geopolitics',
 governance:'AI governance sources',reventure:'Reventure housing data',companies:'Company reports', 'ai-growth':'AI adoption',bubble:'Bubble risk',property:'Home assessments',housing:'Housing heat map',zillow:'State home prices',water:'Water and reservoirs',electricity:'Electricity and power construction',centers:'Data center construction',av:'Autonomous vehicles',space:'Space infrastructure',internet:'Internet research and news',ipv6:'Internet protocol adoption',research:'Watchlist evidence',assets:'Dashboard assets'
} as const;
export type RefreshKey=keyof typeof refreshGroups;
export type RefreshRun={id?:string;provider?:string;status:string;success?:string;attempt?:string;message?:string;warnings?:string[]};
export function refreshProblem(run:RefreshRun|undefined,key:string,now=Date.now()):string|null {
 if(!run)return 'Not yet verified by the scheduled updater.';
 if(['error','partial','snapshot'].includes(run.status))return [run.message,...(run.warnings||[])].filter(Boolean).join(' · ')||'Source refresh failed; last good data retained.';
 const stamp=Date.parse(run.success||'');
 const maxHours=key.startsWith('market-')?4*24:key==='news'?26:8*24;
 if(!Number.isFinite(stamp)||now-stamp>maxHours*3600000)return 'Scheduled verification is overdue; last good data retained.';
 return null;
}
