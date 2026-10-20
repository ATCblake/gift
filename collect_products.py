"""Collect public product metadata for editorial research; never copy retailer prose into pages."""
import json, urllib.request, urllib.parse, re, time
from html.parser import HTMLParser
from pathlib import Path
ROOT=Path(__file__).parent
class Meta(HTMLParser):
    def __init__(self): super().__init__(); self.data={}
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if tag=='meta': self.data[a.get('property',a.get('name',''))]=a.get('content','')
URLS={
 'skyhawk':'https://www.pilotmall.com/products/cessna-172-skyhawk-sp-mahogany-model-high-flying-models',
 'cessna-shirt':'https://www.pilotmall.com/products/cessna-182-officially-licensed-t-shirt',
 'cessna-cap':'https://www.pilotmall.com/products/cessna-navy-scarlet-patch-trucker-cap',
 'ornament':'https://www.pilotmall.com/products/kurt-adler-4-5-navy-blue-angeles-jet-ornament',
 'pen':'https://www.pilotmall.com/products/skilcraft-b3-aviator-multifunction-pen-pencil-black-red-ink-pen2500',
 'bag-tag':'https://www.pilotmall.com/products/crew-bag-tag',
 'logbook':'https://www.pilotmall.com/products/asa-standard-pilot-logbook-black',
 'bose':'https://www.pilotmall.com/products/bose-a30-anr-aviation-headset-battery-powered-with-bluetooth',
 'lightspeed':'https://www.pilotmall.com/products/lightspeed-new-zulu-anr-headset',
 'gift-card':'https://www.sportys.com/sporty-s-email-gift-card.html',
 'kneeboard':'https://www.sportys.com/flight-gear-rotating-ipad-kneeboard.html',
 'bag':'https://www.sportys.com/flight-gear-stealth-bag.html',
 'light':'https://www.sportys.com/flight-gear-universal-aviator-s-light.html',
 'concorde':'https://www.lego.com/en-us/product/concorde-10318',
}
out=[]
(ROOT/'research').mkdir(exist_ok=True)
(ROOT/'dist/assets').mkdir(parents=True,exist_ok=True)
for key,url in URLS.items():
    row={'id':key,'url':url,'checked':'2026-10-20'}
    try:
        req=urllib.request.Request(url,headers={'User-Agent':'PilotGiftGuide research/1.0'})
        source=urllib.request.urlopen(req,timeout=30).read().decode()
        p=Meta(); p.feed(source)
        row.update({k:p.data.get(v) for k,v in {'title':'og:title','description':'og:description','image':'og:image','price':'og:price:amount','currency':'og:price:currency'}.items()})
        if not row['price']: row['price']=p.data.get('product:price:amount')
        if row['image']:
            image_url=urllib.parse.urljoin(url,row['image'])
            image_url=re.sub(r'([?&])width=\d+',r'\g<1>width=800',image_url)
            try:
                response=urllib.request.urlopen(image_url,timeout=30)
                content=response.read(); mime=response.headers.get('Content-Type','')
                ext='.png' if 'png' in mime else '.webp' if 'webp' in mime else '.jpg'
                path=ROOT/'dist/assets'/f'{key}{ext}'; path.write_bytes(content)
                row['local_image']='/assets/'+path.name
            except Exception as e: row['image_error']=str(e)
        print(key,row['title'],row['price'],row.get('local_image','no image'),flush=True)
    except Exception as e: row['error']=str(e); print(key,'ERROR',e,flush=True)
    out.append(row); time.sleep(.3)
(ROOT/'research/products.json').write_text(json.dumps(out,indent=2))
