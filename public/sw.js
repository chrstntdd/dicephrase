(()=>{async function a(e){if(e.request.cache==="only-if-cached"&&e.request.mode!=="same-origin")return;let t=e.request;switch(!0){case(t.method==="GET"&&(t.url==="/"||t.headers.get("accept")?.includes("text/html"))):return fetch(t).catch(c=>(console.error("[onfetch] Failed. Serving cached offline fallback "+c),caches.match("/index.html")));default:return caches.match(e.request).then(c=>c||fetch(e.request)).catch(async()=>await(await caches.open("0ca8778-1641152775014")).match("/index.html"))}}var s=self,n=JSON.parse('["about.html","assets/generate.57f45f77.css","assets/generate.5ab9bf90.js","assets/generated-output.c9fe8480.css","assets/generated-output.fb8a7b8a.js","assets/index.79b84dc3.js","assets/index.7f183e19.css","assets/phrase-output.14ab9faf.js","assets/phrase-output.36c28bc6.css","assets/use-machine.ee01fa07.js","assets/vend-fw.b85b3537.js","assets/vend-xstate.76198443.js","favicons/android-chrome-192x192.png","favicons/android-chrome-512x512.png","favicons/apple-touch-icon.png","favicons/browserconfig.xml","favicons/favicon-16x16.png","favicons/favicon-32x32.png","favicons/favicon.ico","favicons/mstile-150x150.png","favicons/safari-pinned-tab.svg","favicons/site.webmanifest","fonts/Libre_Baskerville/LibreBaskerville-Regular.ttf","fonts/Libre_Baskerville/LibreBaskerville-Regular.woff","fonts/Libre_Baskerville/LibreBaskerville-Regular.woff2","fonts/Libre_Baskerville/OFL.txt","index.html","wl-2016.json"]');s.addEventListener("install",e=>{e.waitUntil(caches.open("0ca8778-1641152775014").then(t=>t.addAll(n)).then(async()=>{(await s.clients.matchAll({includeUncontrolled:!0,type:"window"})).forEach(c=>{c.postMessage({type:"PRECACHE_SUCCESS"})})}).catch(t=>{console.error({reason:t})}))});s.addEventListener("activate",e=>{e.waitUntil(s.clients.claim()),e.waitUntil(caches.keys().then(t=>Promise.all(t.map(c=>{if(c!=="0ca8778-1641152775014")return caches.delete(c)}))))});s.addEventListener("upgrade",()=>{});s.addEventListener("fetch",e=>e.respondWith(a(e)));})();
