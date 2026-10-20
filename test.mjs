import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {execFileSync} from 'node:child_process';
const run=date=>execFileSync(process.execPath,['build.mjs'],{env:{...process.env,BUILD_DATE:date},stdio:'pipe'});
const posts=JSON.parse(fs.readFileSync('posts.json','utf8'));
const content=JSON.parse(fs.readFileSync('content.json','utf8'));
const slugs=[...content.guides,...posts].map(x=>x.slug);assert.equal(new Set(slugs).size,slugs.length,'Duplicate slug');
try{
 run('2026-10-20');
 for(const post of posts)assert.equal(fs.existsSync(`dist/${post.slug}/index.html`),false,'Future article leaked');
 run('2026-10-21');assert.ok(fs.existsSync(`dist/${posts[0].slug}/index.html`));assert.ok(!fs.existsSync(`dist/${posts[1].slug}/index.html`));
 let sitemap=fs.readFileSync('dist/sitemap.xml','utf8');assert.ok(sitemap.includes(posts[0].slug));assert.ok(!sitemap.includes(posts[1].slug));
 run('2026-12-20');for(const post of posts)if(post.status==='ready')assert.ok(fs.existsSync(`dist/${post.slug}/index.html`));
 function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(d=>d.isDirectory()?walk(path.join(dir,d.name)):[path.join(dir,d.name)])}
 const titles=new Set();for(const file of walk('dist').filter(x=>x.endsWith('index.html'))){const html=fs.readFileSync(file,'utf8');assert.equal((html.match(/<h1[ >]/g)||[]).length,1,`${file}: one H1`);const title=html.match(/<title>(.*?)<\/title>/)[1];assert.ok(!titles.has(title),'Duplicate title');titles.add(title);assert.ok(html.includes('<link rel="canonical"'));assert.ok(html.includes('<meta name="description"'));for(const m of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g))JSON.parse(m[1]);for(const m of html.matchAll(/(?:href|src)="(\/[^"#]*)(?:#[^"]*)?"/g)){const target=m[1];assert.ok(fs.existsSync(path.join('dist',target)),`${file}: missing ${target}`)}}
 assert.ok(!fs.readFileSync('dist/index.html','utf8').includes('$0.00'),'Gift card must not display a zero price');
 console.log('PASS: scheduling boundaries, future-page exclusion, sitemap, unique titles, H1s, metadata, structured data, internal links and assets.');
}finally{execFileSync(process.execPath,['build.mjs'],{stdio:'inherit'});}
