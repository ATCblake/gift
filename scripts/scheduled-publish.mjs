import fs from 'node:fs';
const today=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Los_Angeles',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
if(today<'2026-10-21'||today>'2026-12-20'){console.log('Outside the October 21–December 20 publishing window; no deployment requested.');process.exit(0)}
const posts=JSON.parse(fs.readFileSync('posts.json','utf8'));
const todays=posts.filter(p=>p.publish_date===today&&p.status==='ready');
if(!todays.length)console.log('::warning::No ready article is queued for today. See editorial-calendar.html; planned entries are not automatically written.');
const hook=process.env.VERCEL_DEPLOY_HOOK;
if(!hook){console.error('Missing repository secret VERCEL_DEPLOY_HOOK. Scheduling is not connected.');process.exit(1)}
const u=new URL(hook);if(u.protocol!=='https:'||u.hostname!=='api.vercel.com'||!u.pathname.startsWith('/v1/integrations/deploy/'))throw Error('Unexpected deploy hook destination');
const response=await fetch(u,{method:'POST',signal:AbortSignal.timeout(30000)});
if(!response.ok)throw Error(`Deploy request failed (${response.status})`);
// A hook response queues a build; it is not evidence of successful publication.
console.log(`Deployment queued for ${today}; ${todays.length} newly eligible article(s). Check Vercel for build completion.`);
