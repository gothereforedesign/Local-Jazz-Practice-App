const CACHE_NAME = 'jazz-v3'; // Changed to v3 to force update
const ASSETS = [
  './',
  'index.html',
  'manifest.json',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/react@18/umd/react.production.min.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
  'https://unpkg.com/@babel/standalone/babel.min.js',
  'https://unpkg.com/lucide@latest'
];

self.addEventListener('install', (e) => {
  // Use 'no-cors' for CDNs to avoid installation failure if opaque
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // We manually fetch to ensure we can handle opaque responses if needed
      return Promise.all(
        ASSETS.map((url) =>
          fetch(url, { mode: 'no-cors' }).then((res) => cache.put(url, res))
        )
      );
    })
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});
