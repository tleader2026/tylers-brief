export const scanUrl='https://data.wastewaterscan.org/';
export const threats=[
 {id:'covid',label:'COVID-19',target:'SARS-CoV-2',mode:'activity',source:'https://data.cdc.gov/d/atcp-73re',note:'SARS-CoV-2 wastewater activity; not a measurement of Long COVID.'},
 {id:'flu-a',label:'Flu A',target:'Influenza A',mode:'activity',source:'https://data.cdc.gov/d/atcp-73re',note:'Influenza A activity; does not distinguish seasonal subtypes or establish human H5 infections.'},
 {id:'rsv',label:'RSV',target:'RSV',mode:'activity',source:'https://data.cdc.gov/d/atcp-73re',note:'Respiratory syncytial virus activity.'},
 {id:'h5',label:'Bird flu · H5',target:'Influenza A(H5)',mode:'detection',dataset:'mtpu-urpp',source:'https://data.cdc.gov/d/mtpu-urpp',note:'H5 assay detections can have human or animal sources; detection does not establish human infection or the N1 subtype.'},
 {id:'measles',label:'Measles',target:'Measles',mode:'detection',dataset:'akvg-8vrb',source:'https://data.cdc.gov/d/akvg-8vrb',note:'Wild-type measles assays. Wastewater detection is not a confirmed clinical case.'},
 {id:'mpox',label:'Mpox',target:'Mpox',mode:'detection',dataset:'xpxn-rzgz',source:'https://data.cdc.gov/d/xpxn-rzgz',note:'Any reported mpox target; assay and clade coverage vary. No detection does not rule out untested clades.'},
 ...[['flu-b','Flu B'],['hmpv','Human metapneumovirus'],['evd68','Enterovirus D68'],['norovirus','Norovirus GII'],['rotavirus','Rotavirus'],['hepa','Hepatitis A'],['auris','Candidozyma auris'],['mpox-ib','Mpox clade Ib'],['parainfluenza','Parainfluenza'],['adenovirus','Adenovirus group F'],['parvovirus','Parvovirus B19'],['wnv','West Nile virus'],['tb','Tuberculosis'],['blandm','blaNDM · resistance gene']].map(([id,label])=>({id,label,target:label,mode:'external',source:scanUrl,note:'Listed in the WastewaterSCAN monitoring panel. Numerical data are not connected to this dashboard; open the provider map for available sites and dates.'})),
 {id:'ebola',label:'Ebola',target:'Ebola',mode:'unavailable',source:'https://www.cdc.gov/wastewater/about/',note:'No verified routine U.S. public wastewater feed connected. Unavailable is not zero detections or proof of absence.'},
];
export const threatById=(id:string)=>threats.find(t=>t.id===id)||threats[0];
export function recordThreat(r:{provider:string;details?:any}){return r.details?.pathogen|| (r.provider==='cdc'||r.provider==='cdc-wval'?'SARS-CoV-2':'');}
