# Steadily · English Reader

Una PWA local-first para practicar comprensión lectora en inglés de A2 hacia B1. El MVP incluye 11 lecturas graduadas, tests de comprensión, vocabulario y frases personales, progreso por nivel y soporte offline.

## Desarrollo

Requisitos: Node.js 20 o superior.

```bash
npm install
npm run dev
```

Vite mostrará la URL local (normalmente `http://localhost:5173`).

## Build de producción

```bash
npm run build
npm run preview
```

Los archivos de producción se generan en `dist/`. El service worker solo se registra en el build de producción, no durante `npm run dev`.

## Instalación como PWA

1. Abrir el build servido por `npm run preview` o desde un hosting HTTPS.
2. En Chrome/Edge, usar el botón de instalación de la barra de direcciones.
3. En iOS Safari, usar **Compartir → Añadir a pantalla de inicio**.

Después de la primera carga, la aplicación y las lecturas funcionan sin conexión. Todo el progreso se guarda localmente en IndexedDB y no sale del dispositivo.

## Estructura

- `src/data/`: lecturas y diccionario; el contenido está separado de la UI.
- `src/services/db.ts`: única capa de acceso a IndexedDB.
- `src/utils/`: reglas aisladas de vocabulario y progresión.
- `src/hooks/useAppData.ts`: estado de aplicación y coordinación con persistencia.
- `src/components/`: lector, test y componentes compartidos.
- `src/pages/`: Today, Read, Words y Progress.
- `public/sw.js` y `public/manifest.webmanifest`: instalación y caché offline.
- `specs/`: documentación consolidada de producto, arquitectura, contenido y PWA.

Documentación detallada: [producto](specs/PRODUCT.md), [arquitectura](specs/ARCHITECTURE.md), [contenido](specs/CONTENT.md) y [PWA](specs/PWA.md).

## Decisiones del MVP

- Navegación interna sin router para mantener el bundle y la arquitectura pequeños.
- Service worker manual en lugar de un plugin PWA; almacena el shell y, conforme se visitan, los assets generados por Vite.
- Las definiciones prioritarias están incluidas localmente. Las palabras fuera del diccionario reciben una ayuda contextual genérica, sin API ni conexión.
- Un resultado nuevo reemplaza el resultado anterior de esa lectura, manteniendo las estadísticas claras y evitando duplicados.
- El nivel recomendado sube con 3 resultados consecutivos de 80% o más y baja con 2 resultados consecutivos inferiores a 60%. El contenido nunca se bloquea.
- El estado automático del vocabulario vive en `src/utils/vocabulary.ts`; también puede ajustarse manualmente desde Words.

## Extender contenido

Agregar objetos que cumplan la interfaz `Reading` en `src/data/readings.ts`. Para nuevos niveles, ampliar el tipo `Level` y `LEVELS` en `src/types/index.ts` y `src/utils/progression.ts`.
