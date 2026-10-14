export const infrastructureSources={water:'https://www.usgs.gov/data/estimated-use-water-united-states-county-level-data-2015',electricity:'https://www.eia.gov/electricity/annual/xls/epa_02_08.xlsx',plants:'https://www.eia.gov/electricity/data/eia860m/',centers:'https://www.cbre.com/insights/books/north-america-data-center-trends-h1-2026',dmv:'https://www.dmv.ca.gov/portal/vehicle-industry-services/autonomous-vehicles/autonomous-vehicle-testing-permit-holders/'};
export const dataCenterMarkets=[
{name:'Atlanta',state:'GA',lat:33.75,lon:-84.39,mw:2882,status:'Under construction',date:'H1 2026',url:infrastructureSources.centers},
{name:'Northern Virginia',state:'VA',lat:39.04,lon:-77.49,mw:2420.2,status:'Under construction',date:'H1 2026',url:infrastructureSources.centers},
{name:'Dallas–Fort Worth',state:'TX',lat:32.78,lon:-96.80,mw:765,status:'Under construction · more than 765 MW',date:'H1 2026',url:infrastructureSources.centers+'/dallas-ft-worth-data-center-market'},
{name:'Phoenix',state:'AZ',lat:33.45,lon:-112.07,mw:null,status:'3 projects under construction',date:'H1 2026',url:infrastructureSources.centers+'/phoenix-data-center-market'}
];
export const dataCenterProjects=[
{name:'Hyperion · Meta',state:'LA',lat:32.44,lon:-91.77,mw:null,status:'Under construction',date:'2025-12',url:'https://about.fb.com/news/2025/12/metas-richland-parish-data-center-supports-louisiana-economy-875-million-in-contracts/amp/'},
{name:'Madison County campuses · AWS',state:'MS',lat:32.61,lon:-90.04,mw:null,status:'Construction / expansion reported',date:'2026-04',url:'https://www.aboutamazon.com/news/company-news/amazon-25-billion-mississippi-data-centers'},
{name:'Pine Island · Google',state:'MN',lat:44.20,lon:-92.65,mw:null,status:'Announced · construction not verified',date:'2026-02-24',url:'https://blog.google/innovation-and-ai/infrastructure-and-cloud/global-network/data-center-pine-island/'}
];
export const avCompanies=[
{name:'Waymo',miles:'271.3M',period:'Cumulative rider-only miles through June 2026',fleet:'≈3,000',fleetDate:'March 2026 · news-reported fleet estimate',note:'Historical estimate, not the number simultaneously driving today.',url:'https://www.waymo.com/safety/impact/',fleetUrl:'https://www.techradar.com/tech/waymo-is-set-to-launch-its-london-pilot-this-month-heres-what-you-need-to-know',areas:'California deployment permission: see official DMV ODD maps. Company reports service in Phoenix, Austin and Atlanta.',permission:'Deployment / service areas',areaUrl:infrastructureSources.dmv},
{name:'Aurora',miles:'>500,000',period:'Cumulative driverless miles · October 8, 2026',fleet:'5',fleetDate:'October 2025 · regularly scheduled driverless trucks',note:'Historical reported fleet. More than 200 trucks by year-end 2026 is a target, not a current count.',url:'https://aurora.tech/newsroom/driving-the-inflection',fleetUrl:'https://ir.aurora.tech/_assets/_c5fa70a066f295000a1a52c7479cd79b/aurora/db/956/9989/shareholder_letter/25Q3_Shareholder_Letter.pdf',areas:'Dallas–Houston and Fort Worth–El Paso commercial driverless routes reported by company.',permission:'Company-reported routes',areaUrl:'https://ir.aurora.tech/_assets/_ca4c9f4b6c4852717c019d51f51ba5f5/aurora/news/2025-10-28_Aurora_Expands_Driverless_Trucking_Service_from_128.pdf'},
{name:'Zoox',miles:'>3M',period:'Public-road miles reported by Axios · August 5, 2026',fleet:'Not disclosed',fleetDate:'Current driving fleet not verified',note:'Vehicles built are not equivalent to an active driving fleet.',url:'https://www.axios.com/2026/08/05/zooxs-amazon-robotaxis-vegas',fleetUrl:infrastructureSources.dmv,areas:'California driverless testing: Foster City and San Francisco. Las Vegas service is listed by Zoox.',permission:'Testing / service areas',areaUrl:'https://zoox.com/san-francisco'},
{name:'Nuro',miles:'Not disclosed',period:'Comparable current national travel total not verified',fleet:'Not disclosed',fleetDate:'Current national active count not verified',note:'California deployment permit is restricted by location, speed and operating conditions.',url:infrastructureSources.dmv,fleetUrl:infrastructureSources.dmv,areas:'California deployment: Santa Clara and San Mateo counties.',permission:'Deployment permit',areaUrl:infrastructureSources.dmv}
];
export const avLocations=[
{name:'Nuro · Santa Clara County',state:'CA',lat:37.34,lon:-121.89,status:'Deployment permit · 25–35 mph / ODD restrictions',url:infrastructureSources.dmv},
{name:'Nuro · San Mateo County',state:'CA',lat:37.56,lon:-122.32,status:'Deployment permit · ODD restrictions',url:infrastructureSources.dmv},
{name:'Zoox · Foster City',state:'CA',lat:37.56,lon:-122.27,status:'Driverless testing permit · 45 mph / ODD restrictions',url:infrastructureSources.dmv},
{name:'Zoox · San Francisco',state:'CA',lat:37.77,lon:-122.42,status:'Driverless testing permit · 45 mph / ODD restrictions',url:infrastructureSources.dmv},
{name:'WeRide · San Jose',state:'CA',lat:37.33,lon:-121.89,status:'Driverless testing permit · daytime / 50 mph',url:infrastructureSources.dmv},
{name:'Tensor · San Jose',state:'CA',lat:37.30,lon:-121.87,status:'Driverless testing permit · 45 mph / ODD restrictions',url:infrastructureSources.dmv},
{name:'Waymo · Phoenix',state:'AZ',lat:33.45,lon:-112.07,status:'Company-listed service city · not a mapped approval boundary',url:'https://www.waymo.com/about/'},
{name:'Waymo · Austin',state:'TX',lat:30.27,lon:-97.74,status:'Company-listed Uber service city · not an approval boundary',url:'https://www.waymo.com/about/'},
{name:'Waymo · Atlanta',state:'GA',lat:33.75,lon:-84.39,status:'Company-listed Uber service city · not an approval boundary',url:'https://www.waymo.com/about/'}
];
