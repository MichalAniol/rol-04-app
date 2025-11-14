self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('v1').then((cache) => {
      // Cache'owanie zasobów statycznych
      return cache.addAll([
        '/',
        '/index.html',
        '/styles.css',
        '/index.js',
        '/icon-192.png',
        '/icon-512.png'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Sprawdzamy, czy jest odpowiedź w cache
      if (cachedResponse) {
        return cachedResponse;  // Zwracamy dane z cache, jeśli istnieją
      }

      // Jeśli nie, wykonujemy zapytanie do sieci i zapisujemy wynik do cache
      return fetch(event.request).then((networkResponse) => {
        return caches.open('v1').then((cache) => {
          cache.put(event.request, networkResponse.clone());  // Zapisujemy odpowiedź do cache
          return networkResponse;
        });
      });
    })
  );
});
