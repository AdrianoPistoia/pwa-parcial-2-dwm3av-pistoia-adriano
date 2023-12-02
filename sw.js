const CACHE_NAME = '2048-clone';

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll([
        '/',
        '/index.html',
        '/icons/consola.png',
        '/css/style.css',
        '/js/app.js',
        '/sw.js',
        //cache de bootstrap para el offline
        'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
        'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
        // Agregar más recursos que quieras que se almacenen en caché
      ]);
    })
  );
});

// Activación del Service Worker
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (name) {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    })
  );
});

// Intercepta las solicitudes y sirve desde el caché si está disponible
self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (cachedResponse) {
      return cachedResponse || fetch(event.request).then(function (response) {
        return caches.open(CACHE_NAME).then(function (cache) {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});

self.addEventListener("fetch-cache-only", (e) => {
  const cacheResponse = caches.match(e.request);
  e.respondWith(cacheResponse);
});

self.addEventListener("fetch-and-network", (e) => {
  const cacheResponse = caches.match(e.request).then(response => {
    if (!response) {
      return fetch(e.request);
    }
    return response;
  });
  e.respondWith(cacheResponse);
});