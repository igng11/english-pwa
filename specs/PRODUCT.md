# Producto

## Propósito

Steadily es una PWA personal para mejorar la comprensión lectora en inglés de forma progresiva. La versión actual cubre los niveles internos A2.1 a A2.4 y prepara la base para continuar hacia B1 sin bloquear contenido.

La actividad principal es leer textos graduados. El vocabulario, las preguntas de comprensión y las estadísticas existen para apoyar esa actividad, no para reemplazarla.

## Secciones principales

La aplicación tiene cuatro secciones visibles:

- **Today:** recomienda la primera lectura todavía no completada del nivel actual. Si todas están completadas, reutiliza la que lleve más tiempo sin completarse.
- **Read:** muestra las 11 lecturas y permite filtrar por nivel, tema y estado de finalización.
- **Words:** organiza vocabulario en Learning, Almost known, Known y Saved phrases. Cada entrada se puede marcar como conocida conservando su historial o eliminar definitivamente con confirmación.
- **Progress:** resume nivel recomendado, comprensión media por nivel, lecturas, palabras leídas, sesiones, días activos y vocabulario.

## Flujo de lectura

1. El usuario abre una lectura desde Today o Read.
2. El Reader muestra el contenido en una columna enfocada y calcula el avance según el scroll.
3. Cada palabra se puede tocar para ver, en este orden, la traducción al español, una definición simple en inglés y un ejemplo en inglés.
4. Una selección nativa de dos o más palabras muestra la acción `Save phrase` y se puede guardar completa.
5. Al finalizar se responden tres preguntas de opción múltiple.
6. El resultado sustituye el resultado anterior de esa lectura y actualiza la recomendación de nivel.

Para el nivel A2 la estrategia actual muestra la traducción española inmediatamente para reducir fricción, conservando también la definición inglesa. En el futuro se podría ofrecer un modo opcional `English-first`, pero no forma parte del producto actual.

## Alcance actual

- Sin backend, cuentas ni sincronización.
- Sin APIs pagas ni APIs de IA.
- Persistencia exclusivamente local en IndexedDB; la preferencia de tema usa `localStorage`.
- Instalación como PWA y uso offline después de una primera carga correcta.
- Temas claro y oscuro, con preferencia inicial basada en `prefers-color-scheme`.
- Diseño mobile-first con navegación inferior en móvil y lateral en escritorio.

## Fuera de alcance

La versión actual no implementa listening, audio, speech synthesis, shadowing, dictado, importación, ejercicios adicionales, sincronización, autenticación ni generación de contenido.
