const C='pocket-notes-v16';
const FILES=['./','index.html','manifest.json','icon-180.png','icon-192.png','icon-512.png','xlsx.min.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>Promise.all(FILES.map(f=>c.add(new Request(f,{cache:'reload'})).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
function keep(req,res){if(res&&(res.ok||res.type==='opaque')){const cp=res.clone();caches.open(C).then(c=>c.put(req,cp)).catch(()=>{})}return res}
self.addEventListener('fetch',e=>{const q=e.request;if(q.method!=='GET')return;let u;try{u=new URL(q.url)}catch(x){return}
 const same=u.origin===self.location.origin,font=/(^|\.)fonts\.(googleapis|gstatic)\.com$/.test(u.hostname),lib=u.hostname==='cdn.jsdelivr.net';
 if(!same&&!font&&!lib)return;
 if(same&&(q.mode==='navigate'||/\/(index\.html)?$/.test(u.pathname))){
  e.respondWith(new Promise(res=>{let done=false;const fall=()=>caches.match(q).then(h=>h||caches.match('index.html')).then(h=>h||caches.match('./'));
   const tm=setTimeout(()=>{if(!done)fall().then(h=>{if(h&&!done){done=true;res(h)}})},3500);
   fetch(q).then(r=>{keep(q,r);if(!done){done=true;clearTimeout(tm);res(r)}}).catch(()=>{clearTimeout(tm);if(!done)fall().then(h=>{done=true;res(h||Response.error())})})}));return}
 e.respondWith(caches.match(q).then(hit=>{const net=fetch(q).then(r=>keep(q,r)).catch(()=>hit);return hit||net}))});
