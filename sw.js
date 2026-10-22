/* Cupón de la Vez — atualização v25: prioriza sempre conteúdo da rede. */
const OLD_CACHE_PREFIX = 'cupon-de-la-vez-';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key.startsWith(OLD_CACHE_PREFIX)).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith(
    fetch(request, { cache: 'no-store' }).catch(() => {
      if (request.mode === 'navigate') {
        return new Response('<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Sin conexión</title><body style="font-family:system-ui;text-align:center;padding:30px"><h1>Sin conexión</h1><p>Revisa tu internet y vuelve a cargar para ver la versión más reciente.</p></body></html>', {status: 503, headers: {'Content-Type': 'text/html; charset=utf-8'}});
      }
      return Response.error();
    })
  );
});
