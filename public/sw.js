const CACHE_NAME = 'rise-v3';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Network-First Strategy to ensure users always receive latest app bundles
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Never intercept vite dev server HMR / internal modules
  if (
    url.pathname.startsWith('/@') || 
    url.pathname.startsWith('/node_modules') || 
    url.pathname.includes('?t=')
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Only cache valid 200 responses
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(async () => {
        // Fallback to cache only when completely offline
        const cached = await caches.match(event.request);
        if (cached) return cached;

        // If navigate request (HTML document) fails offline, serve root
        if (event.request.mode === 'navigate') {
          const rootCached = await caches.match('/');
          if (rootCached) return rootCached;
        }

        return new Response('Offline', { status: 503, statusText: 'Offline' });
      })
  );
});
