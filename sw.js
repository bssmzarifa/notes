const C='pocket-notes-v32';
const FILES=['./','index.html','manifest.json','icon-180.png','icon-192.png','icon-512.png','xlsx.min.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;
 const req=e.request,nav=req.mode==='navigate'||req.destination==='document';
 if(nav){// network-first for the page: always show the newest build when online, fall back to cache offline
  e.respondWith(fetch(req).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put('index.html',cp));return r}).catch(()=>caches.match('index.html').then(h=>h||caches.match('./'))));return}
 e.respondWith(caches.match(req).then(hit=>{const net=fetch(req).then(r=>{if(r&&(r.ok||r.type==='opaque')){const cp=r.clone();caches.open(C).then(c=>c.put(req,cp))}return r}).catch(()=>hit);return hit||net}))});
