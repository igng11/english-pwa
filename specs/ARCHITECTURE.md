# Arquitectura

## Stack real

- React 19 y React DOM.
- TypeScript 5.7 con configuración estricta.
- Vite 6 con `@vitejs/plugin-react`.
- CSS propio en un único sistema de estilos, sin Tailwind ni biblioteca de componentes.
- APIs nativas del navegador: IndexedDB, Cache Storage, Service Worker y Web App Manifest.

No se usa React Router, gestor de estado externo, librería de IndexedDB ni framework de testing.

## Estructura

```text
public/
  favicon.svg
  icon-192.svg
  icon-512.svg
  manifest.webmanifest
  sw.js
src/
  components/     Lector y componentes reutilizables del flujo
  data/           Lecturas y diccionario local
  hooks/          Coordinación entre estado React y persistencia
  pages/          Today, Read, Words y Progress
  services/       Acceso aislado a IndexedDB
  styles/         Tema y estilos responsive
  types/          Modelo de dominio TypeScript
  utils/          Reglas puras de progresión y vocabulario
  App.tsx         Composición, navegación y flujo reader/test/result
  main.tsx        Montaje de React y registro del service worker
specs/            Documentación técnica y de producto
```

## Estado y flujo de datos

`useAppData` carga resultados, vocabulario y nivel recomendado al iniciar. Expone operaciones para guardar resultados, guardar vocabulario y cambiar estados. Los componentes no acceden directamente a IndexedDB.

El contenido estático entra desde `src/data/readings.ts` y `src/data/dictionary.ts`. Los tipos compartidos están en `src/types/index.ts`. Las reglas puras se mantienen en `src/utils/`.

## Routing

No hay router de URL. `App.tsx` mantiene dos estados:

- `view`: una de `today`, `read`, `words` o `progress`.
- `overlay`: `reader`, `test`, `result` o `null`.

La navegación principal cambia componentes mediante renderizado condicional. Reader, test y resultado reemplazan temporalmente el shell principal. Esta estrategia es suficiente para el MVP, evita una dependencia y no promete URLs compartibles ni historial del navegador.

## Capas del Reader

El panel de vocabulario se renderiza mediante un portal de React directamente en `document.body`. Así, el backdrop y el bottom sheet `position: fixed` no quedan contenidos por el `transform` de la animación de entrada del Reader. En móvil el panel se fija al borde inferior, respeta las safe areas y usa unidades de viewport dinámico; en escritorio se centra como diálogo.

Las palabras del texto son spans seleccionables con semántica y acceso por teclado, no botones nativos, para no interferir con la selección de texto de iOS/Safari. Un tap sin selección abre el panel de palabra. La selección de frases se observa mediante `selectionchange` y `window.getSelection()`, se limita al cuerpo de la lectura y requiere dos o más palabras. Esto permite que la acción `Save phrase` se actualice también al mover los handles nativos después de una pulsación larga.

## Persistencia

`src/services/db.ts` abre la base `steadily-reader` en versión 1 y crea cuatro object stores:

| Store | Clave | Contenido |
| --- | --- | --- |
| `results` | `id` | Último resultado de cada lectura |
| `vocabulary` | `term` | Palabras y frases guardadas |
| `activity` | `id` | Eventos de lectura y vocabulario |
| `settings` | clave externa | Nivel recomendado |

La capa ofrece operaciones pequeñas basadas en Promises (`getAll`, `put`, `remove`, getters y setters específicos). Cambiar el estado de vocabulario actualiza el registro existente; eliminarlo borra solamente su clave en `vocabulary`, sin tocar resultados de lectura, actividad ni ajustes. No hay migraciones adicionales ni índices secundarios en la versión actual.

## Progresión

`src/utils/progression.ts` define el orden `A2.1 → A2.2 → A2.3 → A2.4`.

Para el nivel recomendado actual:

- ordena los resultados por fecha;
- considera únicamente resultados de ese nivel;
- sube un nivel si los últimos tres resultados son de 80% o más;
- baja un nivel si los últimos dos son inferiores a 60%;
- en cualquier otro caso mantiene el nivel;
- limita el resultado al primer y último nivel disponibles.

La biblioteca nunca bloquea lecturas. Como `results` usa el ID de la lectura como clave, una repetición sustituye el resultado anterior de ese texto.

## Vocabulario

La regla aislada en `src/utils/vocabulary.ts` clasifica así:

- `learning`: menos de tres aciertos o sin alcanzar los demás umbrales;
- `almost-known`: al menos tres aciertos y 70% de precisión;
- `known`: al menos cinco aciertos y 85% de precisión.

El usuario también puede modificar el estado manualmente desde Words.
