'use client';
import {useEffect,useMemo,useRef,useState} from 'react';
import 'leaflet/dist/leaflet.css';
import type {RecordData} from '../lib/catalog';
import {trialSites,inProgress} from '../lib/trials-view';
export default function TrialMap({records,open,onRefresh,busy}:{records:RecordData[];open:(r:RecordData)=>void;onRefresh:()=>void;busy:boolean}){
 const container=useRef<HTMLDivElement>(null),mapRef=useRef<any>(null),[scope,setScope]=useState('ongoing'),[mapError,setMapError]=useState('');
 const rows=useMemo(()=>records.filter(r=>scope==='all'||inProgress(r)),[records,scope]);
 const sites=useMemo(()=>trialSites(rows),[rows]);
 const last=records.map(r=>r.retrieved).sort().at(-1);
 const checkedFreshness=useRef(false);
 useEffect(()=>{if(!last||checkedFreshness.current)return;checkedFreshness.current=true;if(Date.now()-Date.parse(last)>30*86400000)onRefresh();},[last]);
 useEffect(()=>{let cancelled=false;let map:any;setMapError('');
  import('leaflet').then(L=>{if(cancelled||!container.current)return;
   map=L.map(container.current,{scrollWheelZoom:false}).setView([38,-97],4);map.fitBounds([[24,-125],[50,-66]],{padding:[15,15],maxZoom:4});mapRef.current=map;
   const tiles=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);
   tiles.on('tileerror',()=>setMapError('Base map tiles are unavailable. Pins and the location list remain available.'));
   const groups=new Map<string,typeof sites>();for(const s of sites){const key=s.site.geoPoint.lat+','+s.site.geoPoint.lon;groups.set(key,[...(groups.get(key)||[]),s]);}
   for(const group of groups.values()){const {site}=group[0],box=document.createElement('div'),heading=document.createElement('strong');heading.textContent=site.facility||site.city||'Registry location';box.appendChild(heading);const place=document.createElement('p');place.textContent=[site.city,site.state,site.country].filter(Boolean).join(', ');box.appendChild(place);
    for(const {record,site:s} of group){const button=document.createElement('button');button.type='button';button.className='map-trial-link';button.textContent=record.title+' · '+(s.status||'Site status not listed');button.addEventListener('click',()=>open(record));box.appendChild(button);}
    L.marker([site.geoPoint.lat,site.geoPoint.lon],{title:(site.facility||site.city)+' · '+new Set(group.map(s=>s.record.id)).size+' trials',icon:L.divIcon({className:'trial-map-pin',html:'<span>'+new Set(group.map(s=>s.record.id)).size+'</span>',iconSize:[30,30],iconAnchor:[15,30]})}).addTo(map).bindPopup(box,{maxWidth:340});
   }
   L.control.scale({imperial:false}).addTo(map);
  }).catch(()=>setMapError('Map could not load. Use the registry location list below.'));
  return()=>{cancelled=true;map?.remove();mapRef.current=null;};
 },[sites]);
 const allSites=()=>{const coords=sites.map(({site}:any)=>[site.geoPoint.lat,site.geoPoint.lon]);if(coords.length)mapRef.current?.fitBounds(coords,{padding:[30,30],maxZoom:10});};
 return <section className="panel trial-map-panel"><div className="panel-head"><div><h3>Where trials are happening</h3><p>{new Set(sites.map(s=>s.record.id)).size} trials · {sites.length} registry-listed locations</p></div><select aria-label="Trials shown on map" value={scope} onChange={e=>setScope(e.target.value)}><option value="ongoing">In progress</option><option value="all">All registry trials</option></select></div><div className="trial-map-controls"><button className="button" onClick={()=>mapRef.current?.fitBounds([[24,-125],[50,-66]],{padding:[15,15],maxZoom:4})}>United States</button><button className="button" onClick={allSites}>Fit all locations</button><button className="quiet" onClick={onRefresh} disabled={busy}>{busy?'Refreshing…':'Refresh trial data'}</button></div>{mapError&&<p className="news-notice" role="status">{mapError}</p>}<div ref={container} className="trial-map-canvas" aria-label="Interactive trial locations map"/><div className="trial-map-caption">Pins group trials at the same coordinates. Click a pin to see institutions and studies. Site recruitment requires confirmation.<br/>Registry data retrieved {last?new Date(last).toLocaleDateString('en-US'):'not yet'} · {rows.filter(r=>!trialSites([r]).length).length} trials have no usable coordinates.</div><details className="trial-location-list"><summary>Browse accessible location list ({sites.length})</summary>{sites.map(({record,site},i)=><button key={record.id+':'+i} onClick={()=>open(record)}><strong>{site.facility||'Registry location'}</strong><span>{[site.city,site.state,site.country].filter(Boolean).join(', ')} · {record.id}</span><span>{record.title}</span></button>)}</details></section>;
}


