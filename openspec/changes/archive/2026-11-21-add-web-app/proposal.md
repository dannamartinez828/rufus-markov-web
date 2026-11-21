# Proposal

## Why

El proyecto ya calcula las distribuciones temporales de Rufus, pero aún no permite explorarlas desde una página web. Una interfaz responsive en español hará visibles los estados, las probabilidades de transición y los resultados del modelo existente sin duplicar sus cálculos.

## What Changes

- Añadir una página en español con selector visual del estado inicial, tabla de transición y tarjetas para 1, 3, 5 y 10 saltos.
- Mostrar las probabilidades formateadas y, en cada tarjeta, el estado más probable con su imagen.
- Mantener la lógica de presentación pura en `src/format.js` y conectar la interfaz con las funciones existentes del modelo.
- Añadir pruebas `node:test` para los formateadores y configurar `npm start` para servir la aplicación en `http://localhost:8000` usando el servidor HTTP integrado de Node, sin dependencias externas.

## Capabilities

### New Capabilities

- `markov-web-interface`: experiencia web responsive para explorar y visualizar las predicciones temporales de Rufus.

### Modified Capabilities

Ninguna. La capacidad existente `markov-prediction` se consume sin cambiar sus requisitos.

## Impact

- Nuevos `index.html`, `src/app.js`, `src/format.js`, `src/styles.css` y servidor estático mínimo `src/server.js`.
- Actualización de `package.json` para añadir `npm start`; nuevas pruebas en `tests/format.test.js`.
- Reutiliza `src/config.js`, `src/markov.js` e imágenes existentes en `assets/img/`; no añade dependencias.
