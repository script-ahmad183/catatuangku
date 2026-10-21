const C='cuk8';self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(['./','index.html','manifest.json','icon.svg'])))});
self.addEventListener('activate',e=>e.waitUntil(clients.claim()));
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!='GET'||new URL(r.url).origin!=location.origin)return;e.respondWith(fetch(r).then(x=>{const k=x.clone();caches.open(C).then(c=>c.put(r,k));return x}).catch(()=>caches.match(r)))});
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(clients.matchAll({type:'window'}).then(l=>l.length?l[0].focus():clients.openWindow('./')))});
self.addEventListener('periodicsync',e=>{if(e.tag!='cek-tagihan')return;e.waitUntil((async()=>{const c=await caches.open('cuk-data'),r=await c.match('rem.json');if(!r)return;const L=await r.json(),dr=await c.match('done.json'),dn=dr?await dr.json():{},now=new Date(Date.now()-new Date().getTimezoneOffset()*6e4).toISOString().slice(0,10),fm=x=>'Rp'+Math.round(x).toLocaleString('id-ID');let ch=0;
for(const x of L){const n=Math.round((new Date(x.due+'T00:00:00')-new Date(now+'T00:00:00'))/864e5),lim=x.s=='d'?3:7;if(n>lim||(x.s=='s'&&n<0))continue;const k=x.id+'|'+x.due+'|'+(n<0?'o':n<=1?'1':String(lim));if(dn[k])continue;dn[k]=1;ch=1;
await self.registration.showNotification(x.s=='d'?'Tagihan jatuh tempo':'Target tabungan mendekat',{body:`${x.name} · ${fm(x.amt)} · ${n<0?'terlambat '+(-n)+' hari':n==0?'hari ini':'H-'+n}`,icon:'icon.svg',tag:k})}
if(ch)await c.put('done.json',new Response(JSON.stringify(dn)))})())});
