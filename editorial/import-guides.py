"""Import authored editorial manuscripts; no automated prose generation."""
import json,re,pathlib
root=pathlib.Path(__file__).resolve().parent.parent
articles=[]
sources=json.loads((root/'editorial/sources.json').read_text())
for path in sorted((root/'editorial').glob('*.txt')):
 for block in path.read_text().split('\n===\n'):
  lines=[s.strip() for s in block.strip().splitlines() if s.strip()]
  if not lines:continue
  slug,category,title=lines[0].split('|',2)
  intro=lines[1];advice=lines[2]
  description=''
  for sentence in re.split(r'(?<=[.!?])\s+',intro):
   candidate=(description+' '+sentence).strip()
   if len(candidate)>160:break
   description=candidate
  if not description:raise ValueError('Write a shorter opening sentence: '+slug)
  selections=[]
  for line in lines[3:]:
   name,body=line.split('::',1)
   selections.append({'title':name,'body':body.strip()})
  articles.append({'slug':slug,'category':category,'title':title,'short':title,'intro':intro,'description':description,'sections':[['How to choose',advice]],'selections':selections,'picks':[],'publish_date':'2026-10-20','selection_method':'Our selections prioritize personal relevance, usefulness, and fit for the recipient. Named products and destinations link to official sources where applicable.'})
assert len({a['slug'] for a in articles})==len(articles)
for article in articles:
 assert re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*',article['slug']),article['slug']
 assert len(article['selections'])==10,article['slug']
 evidence=sources.get(article['slug'],{})
 if evidence.get('sources'):article['sources']=evidence['sources']
 for selection,url in zip(article['selections'],evidence.get('item_sources',[])):
  if url:selection['source']=url
(root/'expanded-guides.json').write_text(json.dumps(articles,ensure_ascii=False,indent=2)+'\n')
print('Authored guides:',len(articles))
