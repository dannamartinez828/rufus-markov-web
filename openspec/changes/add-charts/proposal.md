# Proposal

## Why

La aplicación presenta predicciones puntuales para cuatro horizontes, pero no permite seguir cómo cambia la distribución en cada salto. Dos gráficas complementarán esas tarjetas y facilitarán comparar tanto la evolución temporal como los horizontes seleccionados.

## What Changes

- Añadir Chart.js 4.4.1 desde cdnjs.cloudflare.com mediante un script cargado antes del módulo `src/app.js`, sin agregar dependencias npm.
- Añadir `evolucionPorPasos(estadoInicial, pasos)` al modelo para devolver las distribuciones desde el paso 0 hasta `pasos`, inclusive.
- Crear funciones puras en `src/charts-data.js` para preparar la serie de evolución y la comparación de horizontes, con pruebas `node:test`.
- Crear `src/charts.js` para construir y actualizar dos gráficas: una de líneas para la evolución por salto y otra de barras agrupadas para los pasos 1, 3, 5 y 10.
- Integrar las gráficas con la selección del estado inicial, conservando las tarjetas y su tabla si Chart.js no está disponible.
- Configurar ejes, tooltips, leyendas, paleta fija por estado, accesibilidad y diseño responsive según los requisitos.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `markov-prediction`: añadir el cálculo de distribuciones para todos los pasos desde cero hasta el límite solicitado.
- `markov-web-interface`: añadir las dos gráficas, su actualización al cambiar el estado inicial, configuración visual y comportamiento alternativo cuando Chart.js no carga.

## Impact

- `src/markov.js` y `tests/markov.test.js`.
- Nuevos `src/charts-data.js`, `tests/charts-data.test.js` y `src/charts.js`.
- `index.html` para cargar Chart.js 4.4.1 antes de `src/app.js`, y `src/app.js` / `src/styles.css` para integrar, actualizar y presentar las gráficas.
- Dependencia de ejecución servida desde cdnjs.cloudflare.com; no se agregan paquetes npm.
