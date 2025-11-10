
const cacheName = 'meu-site-v1';
const arquivosParaCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  // Adicione todos os arquivos usados no seu site
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(arquivosParaCache);
    })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(resposta => {
      return resposta || fetch(e.request);
    })
  );
});
