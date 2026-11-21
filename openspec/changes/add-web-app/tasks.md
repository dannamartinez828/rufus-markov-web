# Tasks

## 1. Servir y estructurar la aplicación

- [ ] 1.1 Añadir `src/server.js` con el servidor estático de Node y el script `npm start` sin reemplazar `npm test`; verificar que `npm start` sirve `index.html` en `http://localhost:8000` y que atiende los módulos e imágenes requeridos.
- [ ] 1.2 Crear `index.html` con estructura semántica en español, referencias al CSS y al módulo de la aplicación, título, explicación y pie de atribución; verificar que la página se obtiene desde el servidor local.

## 2. Crear la lógica de presentación e integrar el modelo

- [ ] 2.1 Implementar `formatearPorcentaje` y `estadoMasProbable` en `src/format.js`; añadir pruebas `node:test` para `formatearPorcentaje(0.5)`, máximos únicos y empates, y verificar con `npm test`.
- [ ] 2.2 Implementar `src/app.js` para presentar el selector accesible con imágenes, la tabla del modelo y las cuatro tarjetas usando `resultadosPorPasos`; actualizar las tarjetas al cambiar el estado y verificar en navegador los cuatro horizontes, probabilidades, imágenes y textos alternativos.

## 3. Adaptar el diseño a distintos tamaños

- [ ] 3.1 Implementar en `src/styles.css` la paleta marrón, naranja y rojo óxido, la codificación visual de probabilidades y los diseños responsive; verificar en navegador los contenidos en móvil y escritorio, la legibilidad de la tabla y la presencia del pie de atribución, y ejecutar `npm test`.
