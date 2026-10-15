"use client";
import {useEffect,useRef,useState} from 'react';
import type {CapacityRow} from '../lib/healthcare-capacity';
import 'leaflet/dist/leaflet.css';
export default function CapacityMap({rows,layer,onSelect}:{rows:CapacityRow[];layer:'occupancy'|'icuOccupancy'|'covidRate'|'reporting';onSelect:(code:string)=>void}){
 const box=useRef<HTMLDivElement>(null),mapRef=useRef<any>(null),selectRef=useRef(onSelect),viewRef=useRef('us'),[error,setError]=useState('');selectRef.current=onSelect;
 function frame(map:any){if(viewRef.current==='alaska')map.setView([63,-151],3,{animate:false});else if(viewRef.current==='hawaii')map.setView([20.8,-157],6,{animate:false});else map.fitBounds([[24,-125],[50,-66]],{padding:[15,15],animate:false});}
 function region(value:string){viewRef.current=value;if(mapRef.current)frame(mapRef.current);}
 useEffect(()=>{let stopped=false,map:any,resize:ResizeObserver|undefined;setError('');Promise.all([import('leaflet'),fetch('/us-states.json').then(r=>{if(!r.ok)throw Error('Boundaries unavailable');return r.json();})]).then(([L,geo])=>{
 if(stopped||!box.current)return;
 map=L.map(box.current,{scrollWheelZoom:false,zoomAnimation:false,fadeAnimation:false,markerZoomAnimation:false}).setView([38,-97],4);mapRef.current=map;
 L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'&copy; OpenStreetMap contributors · State boundaries: U.S. Census Bureau 2024'}).addTo(map).on('tileerror',()=>setError('Base tiles are unavailable; medical state colors and the jurisdiction table remain available.'));
 L.geoJSON(geo as any,{style:(f:any)=>{const row=rows.find(r=>r.code===f.properties.STUSAB),v=row?.[layer],high=layer==='covidRate'?5:100,t=v==null?0:Math.min(1,v/high);return {weight:1.5,color:'#fff6de',fillOpacity:.85,fillColor:v==null?'#8a969d':`rgb(${Math.round(100+155*t)},${Math.round(205-80*t)},${Math.round(185-50*t)})`};},onEachFeature:(f:any,l:any)=>{const r=rows.find(r=>r.code===f.properties.STUSAB);l.bindTooltip(f.properties.NAME+' · '+(r?.[layer]==null?'Not reported':r[layer]+' '+(layer==='covidRate'?'per 100,000':'%')));l.on('click',()=>selectRef.current(f.properties.STUSAB));}}).addTo(map);
 L.control.scale().addTo(map);frame(map);
 resize=new ResizeObserver(entries=>{if(stopped||!entries[0]?.contentRect.width||!entries[0]?.contentRect.height)return;map.invalidateSize({animate:false,pan:false});frame(map);});resize.observe(box.current);
 }).catch(()=>{if(!stopped)setError('Map unavailable; use the jurisdiction selector and table.');});return()=>{stopped=true;resize?.disconnect();map?.remove();mapRef.current=null;};},[rows,layer]);
 return <><div className="trial-map-controls hc-map-controls"><button onClick={()=>region('us')}>Contiguous U.S.</button><button onClick={()=>region('alaska')}>Alaska</button><button onClick={()=>region('hawaii')}>Hawaii</button></div>{error&&<p role="status">{error}</p>}<div ref={box} className="trial-map-canvas hc-map" aria-label="United States healthcare capacity map"/><small>Census state boundaries · gray = missing · warmer = higher value. COVID admission scale caps at 5 per 100,000; percentage layers at 100%. Reporting coverage is a quality indicator. Territories remain selectable in the table.</small></>;
}
