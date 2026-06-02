/* Service Worker — dicmoney v0.9.1
   전략: stale-while-revalidate (캐시 우선 응답 + 백그라운드 갱신) */

const CACHE_NAME = 'dicmoney-v0.9.1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './assets/css/style.css',
  './assets/js/data.js',
  './assets/js/theme.js',
  './assets/js/search.js',
  './assets/js/filter.js',
  './assets/js/modal.js',
  './assets/js/app.js',
  './data/terms.json',
  './assets/icons/icon.svg',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then((cached) => {
      const fetched = fetch(e.request)
        .then((res) => {
          if (res && res.status === 200 && res.type === 'basic') {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
          }
          return res;
        })
        .catch(() => cached);
      return cached || fetched;
    })
  );
});
