const CACHE='fd8-1792728111';
const SHELL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','data.enc'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE&&k.startsWith('fd8-')).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);if(e.request.method!=='GET')return;
  const local=u.origin===location.origin;
  if(local&&(e.request.mode==='navigate'||u.pathname.endsWith('/index.html')||u.pathname.endsWith('/data.enc')||u.pathname.endsWith('/'))){
    e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match('index.html'))));return}
  if(local||u.host.endsWith('fonts.googleapis.com')||u.host.endsWith('fonts.gstatic.com')){
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{const c=res.clone();caches.open(CACHE).then(x=>x.put(e.request,c));return res})))}
});
