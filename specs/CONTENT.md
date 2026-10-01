# Contenido

## Fuente y separación

Las lecturas viven en `src/data/readings.ts` como objetos TypeScript, fuera de los componentes. El diccionario local se compone en `src/data/dictionary.ts`; las equivalencias contextuales en español viven en `src/data/translations-es.ts`. No se descarga contenido y no existe una API de contenido.

## Modelo de lectura

Cada objeto `Reading` contiene:

- `id`: identificador estable;
- `title`;
- `level`: A2.1, A2.2, A2.3 o A2.4;
- `topic`;
- `estimatedMinutes`;
- `text`;
- `targetVocabulary`;
- `grammar`;
- `questions` con enunciado y opciones en inglés, sus traducciones españolas y el mismo índice correcto.

`src/data/sentence-translations.ts` contiene pares explícitos de oración inglesa y traducción española por ID de lectura. Los pares reproducen exactamente las 211 oraciones del corpus; el Reader usa estos límites declarados para obtener el contexto tocado, sin intentar traducir ni reconstruir la oración mediante una API.

## Dataset actual

Hay 11 lecturas:

| Nivel | Cantidad |
| --- | ---: |
| A2.1 | 3 |
| A2.2 | 3 |
| A2.3 | 3 |
| A2.4 | 2 |

Los temas presentes son Technology, Programming, Work, Business, Daily Life, Travel, Culture y Short Stories. Cada texto actual tiene entre 211 y 253 palabras y tres preguntas que se responden desde la lectura.

La longitud normal objetivo de una lectura es de 220 a 260 palabras. No debe crecer progresivamente solo porque sube el nivel: la dificultad debe aumentar principalmente mediante el vocabulario, las estructuras y la comprensión, no mediante textos mucho más largos.

La segunda lectura del corpus actual representa aproximadamente el punto de partida práctico deseado según el uso real. El usuario comprende la mayoría de las palabras por separado, pero necesita más exposición a combinaciones naturales de vocabulario conocido, collocations, phrasal patterns sencillos, conectores y estructuras que todavía no produce espontáneamente. Las lecturas futuras no deben reducir artificialmente la dificultad hacia textos demasiado básicos.

El progreso debe aumentar principalmente mediante esas combinaciones, conectores, estructuras gramaticales gradualmente más ricas y comprensión contextual. La longitud objetivo continúa siendo 220–260 palabras y no debe usarse como mecanismo principal de dificultad.

Se incorporarán progresivamente lecturas inspiradas en noticias y acontecimientos actuales. Deben redactarse o adaptarse como material educativo para A2/B1, nunca copiar artículos periodísticos. Por ahora seguirán formando parte del contenido local para conservar la arquitectura offline, sin APIs ni conexiones externas.

## Diccionario

El diccionario mapea una palabra normalizada a:

- definición sencilla en inglés;
- traducción al español;
- ejemplo en inglés.

`cleanTerm` unifica apóstrofos tipográficos, conserva letras Unicode, elimina puntuación exterior y normaliza a minúsculas. Si una palabra no existe en el diccionario, el Reader presenta una ayuda contextual genérica; no consulta servicios externos.

Las 11 lecturas actuales contienen 868 formas únicas después de esa normalización. Todas tienen traducción española local. Las 44 entradas pedagógicas seleccionadas conservan su definición y ejemplo redactados manualmente; para el resto, `dictionary.ts` combina la equivalencia española explícita con una definición breve y la primera oración real que contiene la forma como ejemplo. El fallback queda reservado para vocabulario de lecturas futuras todavía no incorporado al dataset.

Las 33 palabras objetivo del dataset tienen definición, traducción española y ejemplo curados. El diccionario también incluye formas que aparecen literalmente en las lecturas, como `updates`, palabras funcionales como `she` y nombres propios. No se generan traducciones durante el uso de la app: todo el español está incluido en el bundle local y funciona offline.

## Frases

Las selecciones de más de una palabra y menos de 140 caracteres se guardan completas. Se identifican mediante `isPhrase` y aparecen en Saved phrases. La implementación no reduce la expresión a una palabra base.

## Mantenimiento del contenido

Una lectura sólo está completa cuando incluye texto inglés, traducciones españolas de todo el vocabulario, traducción contextual de cada oración, preguntas y opciones en ambos idiomas. No debe entrar al corpus con cobertura parcial. Las traducciones españolas deben ser naturales y conservar el significado contextual, no calcos palabra por palabra.

Las nuevas lecturas deben ajustarse a la interfaz `Reading`, mantener identificadores estables y conservar preguntas respondibles solamente a partir del texto. Si se añade un nivel, también hay que ampliar `Level` en `src/types/index.ts` y `LEVELS` en `src/utils/progression.ts`.
