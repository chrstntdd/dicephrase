(()=>{async function a(e){if(e.request.cache==="only-if-cached"&&e.request.mode!=="same-origin")return;let t=e.request;switch(!0){case(t.method==="GET"&&(t.url==="/"||t.headers.get("accept")?.includes("text/html"))):return fetch(t).catch(c=>(console.error("[onfetch] Failed. Serving cached offline fallback "+c),caches.match("/index.html")));default:return caches.match(e.request).then(c=>c||fetch(e.request)).catch(async()=>await(await caches.open("eb09fd9-1641169598240")).match("/index.html"))}}var s=self,n=JSON.parse('["about.html","assets/generate.57f45f77.css","assets/generate.e37a56d3.js","assets/generated-output.a7b60d2d.js","assets/generated-output.c9fe8480.css","assets/index.7f183e19.css","assets/index.a91f2d07.js","assets/phrase-output.36c28bc6.css","assets/phrase-output.e268ad62.js","assets/use-machine.53a91ab5.js","assets/vend-fw.b85b3537.js","assets/vend-xstate.76198443.js","favicons/android-chrome-192x192.png","favicons/android-chrome-512x512.png","favicons/apple-touch-icon.png","favicons/browserconfig.xml","favicons/favicon-16x16.png","favicons/favicon-32x32.png","favicons/favicon.ico","favicons/mstile-150x150.png","favicons/safari-pinned-tab.svg","favicons/site.webmanifest","fonts/Libre_Baskerville/LibreBaskerville-Regular.ttf","fonts/Libre_Baskerville/LibreBaskerville-Regular.woff","fonts/Libre_Baskerville/LibreBaskerville-Regular.woff2","fonts/Libre_Baskerville/OFL.txt","index.html","wl-2016.json"]');s.addEventListener("install",e=>{e.waitUntil(caches.open("eb09fd9-1641169598240").then(t=>t.addAll(n)).then(async()=>{(await s.clients.matchAll({includeUncontrolled:!0,type:"window"})).forEach(c=>{c.postMessage({type:"PRECACHE_SUCCESS"})})}).catch(t=>{console.error({reason:t})}))});s.addEventListener("activate",e=>{e.waitUntil(s.clients.claim()),e.waitUntil(caches.keys().then(t=>Promise.all(t.map(c=>{if(c!=="eb09fd9-1641169598240")return caches.delete(c)}))))});s.addEventListener("upgrade",()=>{});s.addEventListener("fetch",e=>e.respondWith(a(e)));})();
