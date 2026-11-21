# Proposal

## Why

La aplicación ya predice estados temporales, pero sus nombres y recursos visuales no reflejan la historia completa de los bucles de *Deponia Doomsday*. Enriquecer cada estado y permitir una simulación reproducible hará que las predicciones y el recorrido sean más fáciles de entender y explorar.

## What Changes

- **BREAKING** Renombrar los estados a Aldea Kuvaq, Eliseo, Tiempo intermedio y Reinicio, conservando exactamente la matriz de transición actual y agregando descripción, escena y pose a cada estado.
- Mostrar las escenas como fondo y la pose de Rufus superpuesta en las tarjetas; añadir la pose al encabezado y usar imágenes con carga diferida y texto alternativo en español.
- Incorporar las secciones “Los personajes del bucle” y “Cómo leer esta aplicación” con el contenido indicado.
- Añadir `simularRecorrido(estadoInicial, saltos, aleatorio = Math.random)` y un simulador visual de 10 saltos que muestre el camino y cuántas veces aparece Reinicio.
- Actualizar el servidor para responder con MIME type de imagen JPEG a recursos `.jpg` y adaptar las pruebas existentes a los nuevos estados y metadatos.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `markov-prediction`: cambiar los nombres de los estados, añadir sus metadatos y especificar la simulación aleatoria de recorridos con generador inyectable.
- `markov-web-interface`: actualizar las imágenes y nombres de estado, añadir personajes, guía de lectura y simulador, y ampliar el servicio de imágenes `.jpg`.

## Impact

- `src/config.js`, `src/markov.js`, `src/app.js`, `src/format.js`, `src/server.js` e `index.html`.
- `src/styles.css` para las escenas, poses, nuevas secciones y recorrido.
- `tests/markov.test.js` y `tests/format.test.js` para los nombres y los nuevos comportamientos; las probabilidades de transición no cambian.
- Recursos existentes en `assets/img/escenas/` y `assets/img/rufus/`; no se añaden dependencias externas.
