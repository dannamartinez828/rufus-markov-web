# Design

## Context

Véase `proposal.md` - Why. El proyecto ya es un módulo ES privado con `npm test` y contiene `src/config.js`, `src/markov.js` y las cuatro imágenes en `assets/img/`. No tiene página de entrada ni comando para servirla.

## Goals / Non-Goals

**Goals:**

- Mostrar el modelo existente en una página accesible y adaptable a distintos tamaños.
- Separar el formateo de presentación de la interfaz para probarlo sin DOM.
- Servir la página localmente sin instalar dependencias.

**Non-Goals:**

- Cambiar la matriz, los estados o los cálculos del modelo.
- Introducir frameworks o un sistema de compilación.
- Publicar o desplegar el sitio en un servidor externo.

## Decisions

- `src/app.js` será un módulo del navegador e importará `estados`, `matrizTransicion` y `resultadosPorPasos` directamente de los módulos existentes. Al cambiar la selección, pedirá un nuevo conjunto de resultados al modelo; la interfaz no repetirá operaciones matriciales.
- El primer estado (`Aldea`) estará seleccionado al cargar la página para que selector, tabla y tarjetas tengan contenido desde el inicio. La selección se implementará como un grupo de radios etiquetados con las imágenes; a diferencia de las opciones de un `<select>` nativo, los radios permiten mostrar una imagen por estado de forma consistente y accesible.
- `src/format.js` tendrá funciones puras: `formatearPorcentaje` devolverá `(p * 100).toFixed(1)` más ` %`; `estadoMasProbable` recorrerá la distribución y devolverá el primer máximo según el orden de `estados`.
- La tabla leerá los valores exportados de `matrizTransicion`. Las celdas conservarán el número visible y aplicarán una intensidad de color proporcional a la probabilidad, con texto de contraste suficiente.
- Las imágenes se asociarán por estado a `aldea.png`, `elysium.gif`, `intermedio.png` y `apocalipsis.png`; sus textos alternativos identificarán a Rufus y el estado. Las tarjetas incluirán las cuatro probabilidades y resaltarán el máximo.
- Para `npm start`, `src/server.js` usará `node:http` y APIs estándar de Node para servir `index.html`, módulos y recursos desde el directorio del proyecto en `127.0.0.1:8000`. Restringirá las rutas servidas al contenido del proyecto, devolverá MIME types para HTML, JavaScript, CSS, PNG y GIF, y responderá con error para recursos inexistentes.
- `tests/format.test.js` probará los formateadores con `node:test` y `node:assert`; la interacción DOM y los tamaños responsive se verificarán ejecutando el servidor y revisando la página.

## Risks / Trade-offs

- [El servidor puede servir rutas no previstas si la ruta solicitada no se normaliza] → Resolver las rutas dentro del directorio permitido, rechazar cualquier ruta que escape de él y no habilitar listado de directorios.
- [El color por sí solo puede dificultar la lectura de probabilidades] → Mantener cada valor numérico visible y comprobar contraste del texto sobre los colores elegidos.
- [Los módulos o imágenes pueden no cargar si el servidor asigna un MIME type incorrecto] → Probar los módulos y los cuatro formatos de imagen mediante `npm start`.

## Migration Plan

Añadir el script `start` a `package.json` sin modificar ni reemplazar el script `test`. No hay datos que migrar; para revertir, se pueden retirar la página y el servidor sin alterar el modelo.
