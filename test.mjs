import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {execFileSync} from 'node:child_process';
const run=date=>execFileSync(process.execPath,['build.mjs'],{env:{...process.env,BUILD_DATE:date},stdio:'pipe'});
const posts=JSON.parse(fs.readFileSync('posts.json','utf8'));
const content=JSON.parse(fs.readFileSync('content.json','utf8'));
const expanded=JSON.parse(fs.readFileSync('expanded-guides.json','utf8'));
const launch=[...content.guides,...expanded];
assert.equal(launch.length,100,'Exactly 100 launch articles');
const slugs=[...launch,...posts].map(x=>x.slug);assert.equal(new Set(slugs).size,slugs.length,'Duplicate slug');
const categoriesSet=new Set(JSON.parse(fs.readFileSync('categories.json','utf8')).map(c=>c.slug));
const intros=new Set(),paragraphs=new Set();
for(const g of expanded){
 assert.ok(categoriesSet.has(g.category),'Unknown category: '+g.slug);
 assert.equal(g.selections.length,10,'Every ten-item article needs ten entries: '+g.slug);
 assert.ok(!intros.has(g.intro),'Repeated introduction');intros.add(g.intro);
 const words=[g.intro,...g.sections.flat(),...g.selections.flatMap(p=>[p.title,p.body])].join(' ').split(/\s+/).length;
 assert.ok(words>=300,'Incomplete article: '+g.slug);
 assert.ok(g.description.length<=160&&g.description.length>=40,'Invalid description');
 for(const pick of g.selections){assert.ok(pick.title&&pick.body.split(/\s+/).length>=15,'Thin list entry: '+g.slug);assert.ok(!paragraphs.has(pick.body),'Duplicate list-entry text');paragraphs.add(pick.body);if(pick.source)assert.equal(new URL(pick.source).protocol,'https:');}
}
try{
 run('2026-10-20');
 const launchSitemap=fs.readFileSync('dist/sitemap.xml','utf8');
 const directory=fs.readFileSync('dist/guides/index.html','utf8');
 for(const g of launch){assert.ok(launchSitemap.includes('/'+g.slug+'/'),'Launch guide absent from sitemap');assert.ok(directory.includes('href="/'+g.slug+'/"'),'Launch guide absent from directory');if(g.selections){const html=fs.readFileSync('dist/'+g.slug+'/index.html','utf8');assert.equal((html.match(/id="pick-\d+"/g)||[]).length,10,'Rendered list count: '+g.slug);}}
 for(const g of launch){const html=fs.readFileSync('dist/'+g.slug+'/index.html','utf8');assert.ok(html.includes('class="article-cover"'),'Guide cover missing: '+g.slug);const cover=html.match(/class="article-cover" src="([^"]+)"/)[1];assert.ok(html.includes('property="og:image" content="https://www.pilotgiftguide.com'+cover+'"'),'Guide share image mismatch: '+g.slug);}
 for(const post of posts)assert.equal(fs.existsSync(`dist/${post.slug}/index.html`),false,'Future article leaked');
 run('2026-10-21');assert.ok(fs.existsSync(`dist/${posts[0].slug}/index.html`));assert.ok(!fs.existsSync(`dist/${posts[1].slug}/index.html`));
 let sitemap=fs.readFileSync('dist/sitemap.xml','utf8');assert.ok(sitemap.includes(posts[0].slug));assert.ok(!sitemap.includes(posts[1].slug));
 run('2026-12-20');for(const post of posts)if(post.status==='ready')assert.ok(fs.existsSync(`dist/${post.slug}/index.html`));
 function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(d=>d.isDirectory()?walk(path.join(dir,d.name)):[path.join(dir,d.name)])}
 const titles=new Set();for(const file of walk('dist').filter(x=>x.endsWith('index.html'))){const html=fs.readFileSync(file,'utf8');assert.equal((html.match(/<h1[ >]/g)||[]).length,1,`${file}: one H1`);if(html.includes('href="https://atc.com/"'))assert.ok(html.includes('team behind'),'Own-product link needs a relationship disclosure: '+file);const title=html.match(/<title>(.*?)<\/title>/)[1];assert.ok(!titles.has(title),'Duplicate title');titles.add(title);assert.ok(html.includes('<link rel="canonical"'));assert.ok(html.includes('<meta name="description"'));for(const m of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g))JSON.parse(m[1]);for(const m of html.matchAll(/(?:href|src)="(\/[^"#]*)(?:#[^"]*)?"/g)){const target=new URL(m[1],'https://pilotgiftguide.com').pathname;assert.ok(fs.existsSync(path.join('dist',target)),`${file}: missing ${target}`)}}
 assert.ok(!fs.readFileSync('dist/index.html','utf8').includes('$0.00'),'Gift card must not display a zero price');
 const homepage=fs.readFileSync('dist/index.html','utf8'); assert.equal((homepage.match(/data-slide="/g)||[]).length,3,'Three carousel slides'); assert.equal((homepage.match(/class="ranked-pick"/g)||[]).length,0,'Homepage should link to guides, not product listings'); assert.equal((fs.readFileSync('dist/best-pilot-gift-ideas/index.html','utf8').match(/class="ranked-pick"/g)||[]).length,10,'Top ten rankings preserved in a dedicated guide'); for(const unwanted of ['data-filter=', 'data-saved-count', 'id="gift-finder"', 'class="merchant"', 'class="atc-banner"']) assert.ok(!homepage.includes(unwanted),'Storefront element remains: '+unwanted); const categories=JSON.parse(fs.readFileSync('categories.json')); for(const c of categories)assert.ok(fs.existsSync('dist/categories/'+c.slug+'/index.html'),'Category page missing');
 const headsetImages=JSON.parse(fs.readFileSync('research/headset-images.json'));
 const crypto=await import('node:crypto');
 const covers=headsetImages.map(a=>{const html=fs.readFileSync('dist/'+a.guide+'/index.html','utf8');const src=html.match(/class="article-cover" src="([^"]+)"/)[1];assert.ok(html.includes(a.model),'Pictured model needs a visible label');return crypto.createHash('sha256').update(fs.readFileSync('dist'+src)).digest('hex')});
 assert.equal(new Set(covers).size,12,'Every headset guide must show a different product image, including scheduled guides');
 const atc=JSON.parse(fs.readFileSync('atc-recommendations.json'));
 assert.equal(Object.keys(atc.guides).length,20,'Twenty relevant app recommendations');
 for(const slug of Object.keys(atc.guides)){const html=fs.readFileSync('dist/'+slug+'/index.html','utf8');assert.ok(html.includes('own-product-disclosure'),'Missing nearby app disclosure: '+slug);assert.ok(html.includes(atc.source),'Missing official app details: '+slug);assert.ok(html.includes('atc-app-icon.jpg'),'Missing app image: '+slug)}
 for(const a of headsetImages)assert.ok(!fs.readFileSync('dist/'+a.guide+'/index.html','utf8').includes('own-product-disclosure'),'App should not appear as a headset recommendation');
 console.log('PASS: scheduling boundaries, future-page exclusion, sitemap, unique titles, H1s, metadata, structured data, internal links and assets.');
}finally{execFileSync(process.execPath,['build.mjs'],{stdio:'inherit'});}
