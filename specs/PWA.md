# PWA y funcionamiento offline

## Implementación actual

La PWA está implementada manualmente con APIs del navegador. No usa `vite-plugin-pwa`.

- `public/manifest.webmanifest` define nombre, nombre corto, colores, modo `standalone`, URL inicial e iconos SVG de 192 y 512 píxeles.
- `index.html` enlaza el manifest, favicon y colores de tema para claro y oscuro.
- `src/main.tsx` registra `/sw.js` después del evento `load`, exclusivamente en builds de producción.
- Vite copia los archivos de `public/` al directorio `dist/` sin transformarlos.

## Service worker

`public/sw.js` usa un único caché versionado, actualmente `steadily-v2`.

- **install:** precachea `/`, `index.html`, manifest e iconos; además lee el `index.html` generado para descubrir y precachear los bundles JavaScript/CSS con hash. Luego activa inmediatamente mediante `skipWaiting`.
- **activate:** elimina cachés con nombres distintos y toma control mediante `clients.claim`. Si reemplazó un caché anterior de Steadily, recarga una vez los clientes abiertos para que dejen de ejecutar el bundle viejo; una primera instalación no provoca esa recarga.
- **fetch de navegación:** aplica network-first, actualiza la copia de `index.html` y usa la copia local como fallback offline. Esto evita que un HTML antiguo siga apuntando indefinidamente al bundle de un deploy anterior.
- **otros fetch GET:** aplica cache-first; si no existe una respuesta, usa la red y guarda las respuestas correctas.

Los nombres de JavaScript y CSS cambian en cada build, por lo que el service worker los descubre desde el HTML en vez de mantener una lista manual. Así quedan disponibles offline incluso cuando la primera carga ocurrió antes de que el worker tomara control de la página.

## Decisión sobre `vite-plugin-pwa`

Se evaluó la migración durante la consolidación. El plugin automatizaría el precache de bundles con hash y el versionado mediante Workbox, pero para este MVP sustituiría un service worker pequeño por una cadena considerable de dependencias de desarrollo. No representa una simplificación clara del proyecto completo y entra en tensión con el principio de evitar dependencias innecesarias.

Por ese motivo se conserva la implementación manual. Si el número de rutas o assets crece, o si se necesita una estrategia sofisticada de actualización, conviene reevaluar la decisión.

## Mantenimiento

- Incrementar el nombre del caché cuando cambie de manera incompatible la estrategia o el contenido precacheado.
- Mantener el manifest y los iconos en `public/`.
- Verificar offline sobre un build de producción servido por HTTPS o localhost; el modo `npm run dev` no registra el service worker.
- No almacenar datos personales en Cache Storage: el progreso pertenece a IndexedDB.

## Pronunciación nativa

El Reader usa exclusivamente Web Speech API (`speechSynthesis` y `SpeechSynthesisUtterance`); no descarga audio ni consulta servicios externos. La configuración Voice en Progress muestra solamente las voces inglesas que `speechSynthesis.getVoices()` expone en el dispositivo y escucha `voiceschanged`, porque Safari/iOS puede completar esa lista de manera asíncrona.

La voz elegida se guarda en el object store `settings` de IndexedDB mediante `voiceURI` y, como respaldo, `name + lang`. Cada utterance asigna explícitamente el objeto de voz resuelto y su locale. Palabra, oración y preview pasan por la misma función, usan velocidad natural `1` y cancelan cualquier reproducción anterior.

Las voces instaladas o descargadas en iOS no siempre coinciden con las que WebKit expone a una PWA. Si la voz guardada deja de estar disponible, la aplicación usa una voz inglesa marcada como default, luego una `en-US` o finalmente la primera voz inglesa disponible. Si la API o una voz inglesa no están disponibles, los controles de audio no se muestran y el flujo de lectura continúa sin errores visibles.
