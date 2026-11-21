# Tasks

## 1. Add step-by-step Markov evolution

- [ ] 1.1 Implement `evolucionPorPasos(estadoInicial, pasos)` in `src/markov.js` using iterative vector-by-matrix multiplication; add tests in `tests/markov.test.js` for step 0, inclusive output length, normalized distributions, invalid step counts and unknown states, then run `node --test tests/markov.test.js`.

## 2. Add pure chart-data transformations

- [ ] 2.1 Create `prepararDatosEvolucion` and `prepararDatosHorizontes` in `src/charts-data.js` and cover labels, state order and 0–100 conversion in `tests/charts-data.test.js`; run `node --test tests/charts-data.test.js`.

## 3. Integrate Chart.js and update lifecycle

- [ ] 3.1 Add the Chart.js 4.4.1 cdnjs script before `src/app.js`, create the two accessible canvases and integrate `src/charts.js` with state selection and existing results; verify in the browser that both charts load, repeated state changes keep exactly two canvas/chart instances, and missing `window.Chart` displays a Spanish message while the matrix and result cards still work.

## 4. Style responsive charts

- [ ] 4.1 Add bounded responsive chart containers and mobile styles in `src/styles.css`, preserving the configured 0–100 percent axes, visible legends, state colors and Spanish canvas labels; verify both charts fit at mobile and desktop widths without horizontal overflow.

## 5. Verify the complete feature

- [ ] 5.1 Run `npm test` and `npm start`; verify the page loads at `http://localhost:8000`, the line chart covers steps 0–10, the grouped bar chart covers 1, 3, 5 and 10, and changing the initial state updates both charts and the existing results.
