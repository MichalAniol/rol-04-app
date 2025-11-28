const FONT_URLS = [
  // 100 Thin Italic
  '/fonts/Inter-100-ThinItalic.otf',
  '/fonts/Inter-100-ThinItalic.svg',
  '/fonts/Inter-100-ThinItalic.ttf',
  '/fonts/Inter-100-ThinItalic.woff',
  '/fonts/Inter-100-ThinItalic.woff2',

  // 200 ExtraLight
  '/fonts/Inter-200-ExtraLight.otf',
  '/fonts/Inter-200-ExtraLight.svg',
  '/fonts/Inter-200-ExtraLight.ttf',
  '/fonts/Inter-200-ExtraLight.woff',
  '/fonts/Inter-200-ExtraLight.woff2',

  // 200 ExtraLight Italic
  '/fonts/Inter-200-ExtraLightItalic.otf',
  '/fonts/Inter-200-ExtraLightItalic.svg',
  '/fonts/Inter-200-ExtraLightItalic.ttf',
  '/fonts/Inter-200-ExtraLightItalic.woff',
  '/fonts/Inter-200-ExtraLightItalic.woff2',

  // 300 Light
  '/fonts/Inter-300-Light.otf',
  '/fonts/Inter-300-Light.svg',
  '/fonts/Inter-300-Light.ttf',
  '/fonts/Inter-300-Light.woff',
  '/fonts/Inter-300-Light.woff2',

  // 300 Light Italic
  '/fonts/Inter-300-LightItalic.otf',
  '/fonts/Inter-300-LightItalic.svg',
  '/fonts/Inter-300-LightItalic.ttf',
  '/fonts/Inter-300-LightItalic.woff',
  '/fonts/Inter-300-LightItalic.woff2',

  // 400 Regular Italic
  '/fonts/Inter-400-RegularItalic.otf',
  '/fonts/Inter-400-RegularItalic.svg',
  '/fonts/Inter-400-RegularItalic.ttf',
  '/fonts/Inter-400-RegularItalic.woff',
  '/fonts/Inter-400-RegularItalic.woff2',

  // 400 Regular
  '/fonts/Inter-400-Regular.otf',
  '/fonts/Inter-400-Regular.svg',
  '/fonts/Inter-400-Regular.ttf',
  '/fonts/Inter-400-Regular.woff',
  '/fonts/Inter-400-Regular.woff2',

  // 500 Medium
  '/fonts/Inter-500-Medium.otf',
  '/fonts/Inter-500-Medium.svg',
  '/fonts/Inter-500-Medium.ttf',
  '/fonts/Inter-500-Medium.woff',
  '/fonts/Inter-500-Medium.woff2',

  // 500 Medium Italic
  '/fonts/Inter-500-MediumItalic.otf',
  '/fonts/Inter-500-MediumItalic.svg',
  '/fonts/Inter-500-MediumItalic.ttf',
  '/fonts/Inter-500-MediumItalic.woff',
  '/fonts/Inter-500-MediumItalic.woff2',

  // 600 SemiBold
  '/fonts/Inter-600-SemiBold.otf',
  '/fonts/Inter-600-SemiBold.svg',
  '/fonts/Inter-600-SemiBold.ttf',
  '/fonts/Inter-600-SemiBold.woff',
  '/fonts/Inter-600-SemiBold.woff2',

  // 600 SemiBold Italic
  '/fonts/Inter-600-SemiBoldItalic.otf',
  '/fonts/Inter-600-SemiBoldItalic.svg',
  '/fonts/Inter-600-SemiBoldItalic.ttf',
  '/fonts/Inter-600-SemiBoldItalic.woff',
  '/fonts/Inter-600-SemiBoldItalic.woff2',

  // 700 Bold
  '/fonts/Inter-700-Bold.otf',
  '/fonts/Inter-700-Bold.svg',
  '/fonts/Inter-700-Bold.ttf',
  '/fonts/Inter-700-Bold.woff',
  '/fonts/Inter-700-Bold.woff2',

  // 700 Bold Italic
  '/fonts/Inter-700-BoldItalic.otf',
  '/fonts/Inter-700-BoldItalic.svg',
  '/fonts/Inter-700-BoldItalic.ttf',
  '/fonts/Inter-700-BoldItalic.woff',
  '/fonts/Inter-700-BoldItalic.woff2',

  // 800 ExtraBold
  '/fonts/Inter-800-ExtraBold.otf',
  '/fonts/Inter-800-ExtraBold.svg',
  '/fonts/Inter-800-ExtraBold.ttf',
  '/fonts/Inter-800-ExtraBold.woff',
  '/fonts/Inter-800-ExtraBold.woff2',

  // 800 ExtraBold Italic
  '/fonts/Inter-800-ExtraBoldItalic.otf',
  '/fonts/Inter-800-ExtraBoldItalic.svg',
  '/fonts/Inter-800-ExtraBoldItalic.ttf',
  '/fonts/Inter-800-ExtraBoldItalic.woff',
  '/fonts/Inter-800-ExtraBoldItalic.woff2',

  // 900 Black
  '/fonts/Inter-900-Black.otf',
  '/fonts/Inter-900-Black.svg',
  '/fonts/Inter-900-Black.ttf',
  '/fonts/Inter-900-Black.woff',
  '/fonts/Inter-900-Black.woff2',

  // 900 Black Italic
  '/fonts/Inter-900-BlackItalic.otf',
  '/fonts/Inter-900-BlackItalic.svg',
  '/fonts/Inter-900-BlackItalic.ttf',
  '/fonts/Inter-900-BlackItalic.woff',
  '/fonts/Inter-900-BlackItalic.woff2'
];

const CACHE_NAME = "pwa-cache-v1";

// ------------------------
// INSTALL EVENT — MERGED
// ------------------------
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        "/",              // static assets
        "/index.html",
        "/styles.css",
        "/index.js",
        "/icon-192.png",
        "/icon-512.png",
        ...FONT_URLS      // fonts added here
      ]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  // ------------------------------------
  // 1. Obsługa czcionek z katalogu /fonts/
  // ------------------------------------
  if (request.url.includes("/fonts/")) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) {
          return cached;
        }

        return fetch(request).then((networkResponse) => {
          const cloned = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, cloned);
          });
          return networkResponse;
        });
      })
    );
    return; // zapobiega przejściu do logiki poniżej
  }

  // ------------------------------------
  // 2. Standardowa obsługa pozostałych zasobów
  // ------------------------------------
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request).then((networkResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, networkResponse.clone());
          return networkResponse;
        });
      });
    })
  );
});

