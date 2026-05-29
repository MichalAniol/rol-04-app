
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
  '/fonts/Inter-900-BlackItalic.woff2',

  '/fonts/consolas.otf',
  '/fonts/consolas.svg',
  '/fonts/consolas.ttf',
  '/fonts/consolas.woff',
  '/fonts/consolas.woff2'
];

// sw.js

const CACHE_NAME = 'pwa-cache-v27';

self.addEventListener('install', (event) => {
    self.skipWaiting();

    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll([
                '/index.html',
                '/index24.js',
                '/styles24.css',
                '/icon-192.png',
                '/icon-512.png'
            ]);
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        (async () => {
            const keys = await caches.keys();

            await Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );

            await self.clients.claim();
        })()
    );
});

self.addEventListener('message', (event) => {
    if (event.data?.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

self.addEventListener('fetch', (event) => {
    const request = event.request;

    if (request.method !== 'GET') {
        return;
    }

    // HTML -> network first
    if (
        request.mode === 'navigate' ||
        request.destination === 'document'
    ) {
        event.respondWith(
            (async () => {
                try {
                    const response = await fetch(request, {
                        cache: 'no-store'
                    });

                    const cache = await caches.open(CACHE_NAME);
                    cache.put(request, response.clone());

                    return response;
                } catch {
                    return (
                        (await caches.match(request)) ||
                        caches.match('/offline.html')
                    );
                }
            })()
        );

        return;
    }

    // JS / CSS -> stale while revalidate
    if (
        request.destination === 'script' ||
        request.destination === 'style'
    ) {
        event.respondWith(
            (async () => {
                const cache = await caches.open(CACHE_NAME);
                const cached = await cache.match(request);

                const networkFetch = fetch(request)
                    .then((response) => {
                        if (response.status === 200) {
                            cache.put(request, response.clone());
                        }

                        return response;
                    })
                    .catch(() => cached);

                return cached || networkFetch;
            })()
        );

        return;
    }

    // Images / fonts -> cache first
    if (
        request.destination === 'image' ||
        request.destination === 'font'
    ) {
        event.respondWith(
            caches.match(request).then((cached) => {
                if (cached) {
                    return cached;
                }

                return fetch(request).then((response) => {
                    if (response.status === 200) {
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(request, response.clone());
                        });
                    }

                    return response;
                });
            })
        );

        return;
    }

    event.respondWith(fetch(request));
});