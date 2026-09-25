# Contenido

## Fuente y separación

Las lecturas viven en `src/data/readings.ts` como objetos TypeScript, fuera de los componentes. El diccionario local vive en `src/data/dictionary.ts`. No se descarga contenido y no existe una API de contenido.

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
- `questions` con enunciado, tres opciones e índice correcto.

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

Se incorporarán progresivamente lecturas inspiradas en noticias y acontecimientos actuales. Deben redactarse o adaptarse como material educativo para A2/B1, nunca copiar artículos periodísticos. Por ahora seguirán formando parte del contenido local para conservar la arquitectura offline, sin APIs ni conexiones externas.

## Diccionario

El diccionario mapea una palabra normalizada a:

- definición sencilla en inglés;
- traducción al español;
- ejemplo en inglés.

`cleanTerm` elimina puntuación exterior y normaliza a minúsculas. Si una palabra no existe en el diccionario, el Reader presenta una ayuda contextual genérica; no consulta servicios externos.

## Frases

Las selecciones de más de una palabra y menos de 140 caracteres se guardan completas. Se identifican mediante `isPhrase` y aparecen en Saved phrases. La implementación no reduce la expresión a una palabra base.

## Mantenimiento del contenido

Las nuevas lecturas deben ajustarse a la interfaz `Reading`, mantener identificadores estables y conservar preguntas respondibles solamente a partir del texto. Si se añade un nivel, también hay que ampliar `Level` en `src/types/index.ts` y `LEVELS` en `src/utils/progression.ts`.
