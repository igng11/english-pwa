# PWA y funcionamiento offline

## Implementación actual

La PWA está implementada manualmente con APIs del navegador. No usa `vite-plugin-pwa`.

- `public/manifest.webmanifest` define nombre, nombre corto, colores, modo `standalone`, URL inicial e iconos SVG de 192 y 512 píxeles.
- `index.html` enlaza el manifest, favicon y colores de tema para claro y oscuro.
- `src/main.tsx` registra `/sw.js` después del evento `load`, exclusivamente en builds de producción.
- Vite copia los archivos de `public/` al directorio `dist/` sin transformarlos.

## Service worker

`public/sw.js` usa un único caché llamado `steadily-v1`.

- **install:** precachea `/`, `index.html`, manifest e iconos y activa inmediatamente mediante `skipWaiting`.
- **activate:** elimina cachés con nombres distintos y toma control de clientes mediante `clients.claim`.
- **fetch:** para solicitudes GET aplica cache-first; si no existe una respuesta, usa la red y guarda una copia. Si falla una navegación, devuelve `index.html`.

El JavaScript y CSS con hash producidos por Vite no aparecen en la lista inicial, pero se guardan mediante la estrategia de runtime cache durante la primera carga. Por eso la aplicación funciona offline después de una primera carga completa.

## Decisión sobre `vite-plugin-pwa`

Se evaluó la migración durante la consolidación. El plugin automatizaría el precache de bundles con hash y el versionado mediante Workbox, pero para este MVP sustituiría un service worker pequeño por una cadena considerable de dependencias de desarrollo. No representa una simplificación clara del proyecto completo y entra en tensión con el principio de evitar dependencias innecesarias.

Por ese motivo se conserva la implementación manual. Si el número de rutas o assets crece, o si se necesita una estrategia sofisticada de actualización, conviene reevaluar la decisión.

## Mantenimiento

- Incrementar el nombre `steadily-v1` cuando cambie de manera incompatible la estrategia o el contenido precacheado.
- Mantener el manifest y los iconos en `public/`.
- Verificar offline sobre un build de producción servido por HTTPS o localhost; el modo `npm run dev` no registra el service worker.
- No almacenar datos personales en Cache Storage: el progreso pertenece a IndexedDB.
