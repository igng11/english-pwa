const CACHE = 'steadily-v2'
const APP_SHELL = ['/', '/manifest.webmanifest', '/favicon.svg', '/icon-192.svg', '/icon-512.svg']

async function precacheApp() {
  const cache = await caches.open(CACHE)
  const indexResponse = await fetch('/index.html', { cache: 'reload' })
  const html = await indexResponse.clone().text()
  const assetPaths = [...html.matchAll(/(?:src|href)="(\/assets\/[^"?]+(?:\?[^" ]*)?)"/g)].map((match) => match[1])

  await cache.addAll(APP_SHELL)
  await cache.put('/index.html', indexResponse)
  await cache.addAll([...new Set(assetPaths)])
}

self.addEventListener('install', (event) => {
  event.waitUntil(precacheApp().then(() => self.skipWaiting()))
})

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys()
    const previousAppCaches = keys.filter((key) => key.startsWith('steadily-') && key !== CACHE)

    await Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))
    await self.clients.claim()

    if (previousAppCaches.length > 0) {
      const clients = await self.clients.matchAll({ type: 'window' })
      await Promise.all(clients.map((client) => client.navigate(client.url)))
    }
  })())
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).then(async (response) => {
        if (response.ok) {
          const cache = await caches.open(CACHE)
          await cache.put('/index.html', response.clone())
        }
        return response
      }).catch(() => caches.match('/index.html'))
    )
    return
  }

  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
      if (response.ok) {
        const copy = response.clone()
        caches.open(CACHE).then((cache) => cache.put(event.request, copy))
      }
      return response
    }))
  )
})
