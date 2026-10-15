"""Refresh public supply price snapshots. No keys required; errors retain last good series."""
import argparse,csv,datetime,io,json,pathlib,re,urllib.request,zipfile,xml.etree.ElementTree as ET
from concurrent.futures import ThreadPoolExecutor
ROOT=pathlib.Path(__file__).resolve().parents[1]
NS={'s':'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
def fetch(url):
    return urllib.request.urlopen(url,timeout=45).read()
def fred(data,identifier,asof):
    rows=csv.DictReader(io.StringIO(data.decode('utf-8-sig')))
    if rows.fieldnames != ['observation_date',identifier]: raise ValueError('Unexpected FRED columns')
    points=[]
    for row in rows:
        date=row['observation_date'];datetime.date.fromisoformat(date)
        raw=row[identifier]
        if raw in ('','.'):continue
        value=float(raw)
        if not 0<value<float('inf'):raise ValueError('Invalid price/index value')
        if '2020-01-01'<=date<=asof:points.append({'date':date,'value':value})
    if not points or any(a['date']>=b['date'] for a,b in zip(points,points[1:])):raise ValueError('Empty or unordered series')
    return points

def workbook(data,asof):
    z=zipfile.ZipFile(io.BytesIO(data))
    shared=[''.join(t.itertext()) for t in ET.fromstring(z.read('xl/sharedStrings.xml')).findall('s:si',NS)]
    rows=[]
    for row in ET.fromstring(z.read('xl/worksheets/sheet2.xml')).findall('.//s:sheetData/s:row',NS):
        cells={}
        for c in row.findall('s:c',NS):
            v=c.find('s:v',NS)
            if v is not None:cells[re.sub(r'\d','',c.attrib['r'])]=shared[int(v.text)] if c.attrib.get('t')=='s' else v.text
        rows.append(cells)
    header=next(r for r in rows if 'Aluminum' in r.values() and 'Copper' in r.values())
    columns={v:k for k,v in header.items()}
    output={}
    for name,col in columns.items():
        points=[]
        for r in rows:
            period=r.get('A','')
            if not re.fullmatch(r'\d{4}M\d{2}',period):continue
            date=period[:4]+'-'+period[5:]+'-01'
            if not '2020-01-01'<=date<=asof:continue
            try:value=float(r.get(col,''))
            except ValueError:continue
            if value>0:points.append({'date':date,'value':value})
        output[name]=points
    return output

def main():
    parser=argparse.ArgumentParser();parser.add_argument('--worldbank-cache');parser.add_argument('--as-of',default=datetime.date.today().isoformat());args=parser.parse_args()
    catalog=json.loads((ROOT/'lib/supply-price-catalog.json').read_text(encoding='utf-8-sig'))
    target=ROOT/'lib/supply-prices-snapshot.json'
    previous=json.loads(target.read_text()) if target.exists() else {'series':{}}
    result={'reviewed':args.as_of,'series':{},'warnings':[]}
    wb_error=None
    try:
        wb=workbook(pathlib.Path(args.worldbank_cache).read_bytes() if args.worldbank_cache else fetch(next(s['download'] for s in catalog['series'] if s['origin']=='worldbank')),args.as_of)
    except Exception as e:wb={};wb_error=str(e)
    def collect(s):
        try:
            if s['origin']=='manual':points=s['seed']
            elif s['origin']=='worldbank':
                if wb_error:raise ValueError(wb_error)
                points=wb.get(s['column'],[])
            else:points=fred(fetch(s['download']),s['id'],args.as_of)
            if not points:raise ValueError('No valid observations')
            return s['id'],{'points':points,'retrieved':args.as_of,'published':s.get('published'),'status':'snapshot'}
        except Exception as e:
            old=previous['series'].get(s['id'],{'points':[]})
            return s['id'],{**old,'status':'error','attempted':args.as_of,'error':str(e)}
    with ThreadPoolExecutor(max_workers=4) as pool:
        for identifier,record in pool.map(collect,catalog['series']):
            result['series'][identifier]=record
            if record['status']=='error':result['warnings'].append(identifier+': '+record['error'])
    target.write_text(json.dumps(result,indent=2)+'\n')
    print(json.dumps({'series':len(result['series']),'observations':sum(len(s['points']) for s in result['series'].values()),'warnings':result['warnings']}))
if __name__=='__main__':main()
