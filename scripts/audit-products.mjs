import fs from 'node:fs';
const {products}=JSON.parse(fs.readFileSync(new URL('../product-library.json',import.meta.url),'utf8'));
const date=process.env.AUDIT_DATE||new Intl.DateTimeFormat('en-CA',{timeZone:'America/Los_Angeles',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const threshold=Date.parse(date)-7*86400000;
const due=products.filter(p=>Date.parse(p.price_checked_at)<threshold);
console.log(JSON.stringify({audit_date:date,records:products.length,price_checks_due:due.map(p=>({id:p.id,source:p.source,last_checked:p.price_checked_at})),availability_to_check:products.filter(p=>p.availability!=='available').map(p=>({id:p.id,status:p.availability,source:p.source}))},null,2));
