const CACHE_NAME = 'verb-pwa-v1';
const ASSETS = [
  './',
  './index.html',
  './css/main.css',
  './js/main.js',
  './js/renders.js',
  './verbs/verbs_irregular.json',
  './verbs/verbs_regular.json',
  './images/icons/icon-192x192.png',
  './images/icons/icon-512x512.png'
];

// Событие установки воркера
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Событие активации
self.addEventListener('activate', (event) => {
  console.log('Service Worker активирован');
});

// Перехват запросов (работа в офлайне)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
                      
