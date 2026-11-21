# Design

## Context

See `proposal.md` for motivation. The app already computes distributions for the selected horizons and renders prediction cards independently of any charting library. The change adds a step-by-step model result, transforms it into chart-friendly data, and presents two charts without moving Markov calculations into the UI.

## Goals / Non-Goals

**Goals:**
- Keep the model API and chart-data transformations independent of the browser and Chart.js.
- Reuse chart instances when the selected initial state changes.
- Keep existing predictions usable when the external Chart.js script is unavailable.

**Non-Goals:**
- Change the transition matrix, state order, or existing horizon calculations.
- Add Chart.js to npm dependencies or introduce a frontend framework.
- Persist chart state or allow users to change chart types.

## Decisions

1. **Calculate evolution iteratively.** `evolucionPorPasos(estadoInicial, pasos)` starts with the one-hot initial distribution and multiplies the current row vector by the transition matrix once per step. Return a new vector for each step from 0 through the requested maximum. This avoids independently exponentiating the matrix for every plotted point and gives a direct result for the line chart. Validate the initial state and non-negative integer step count using the model's existing Spanish error conventions.

2. **Keep chart-data preparation pure.** `prepararDatosEvolucion(evolucion, estados)` and `prepararDatosHorizontes(resultados, estados)` in `src/charts-data.js` return Chart.js-compatible `labels` and one `{ label, data }` dataset per state, preserving state order. Evolution labels run from 0 to the last distribution; horizon labels are 1, 3, 5, and 10. Convert probabilities from 0–1 to percentage values from 0–100 at this boundary; neither Chart.js options nor DOM objects belong in the module. This makes its output verifiable with `node:test`.

3. **Load the pinned browser build before the app module.** Add a regular external `<script>` for Chart.js 4.4.1 from cdnjs.cloudflare.com before the existing module script. The synchronous script ordering makes `window.Chart` available before the app module runs; if the request fails, module execution can continue and use the fallback.

4. **Own one Chart.js instance per canvas.** `src/charts.js` holds the line and bar chart instances. On first render it creates them; on subsequent state changes it replaces their labels/data and calls `update()`. This is preferable to replacing canvases or creating new instances on every selection, and prevents duplicate charts.

5. **Use a shared state palette and explicit percentage axes.** Assign Aldea Kuvaq brown (`#684536`), Eliseo Elysium blue (`#3976A8`), Tiempo intermedio orange (`#D77932`), and Reinicio oxide red (`#9D3B27`). Reuse each state's color for both chart types. Configure the vertical scale from 0 to 100, percent tick labels, one-decimal tooltip labels, and visible legends.

6. **Control responsive sizing with the parent container.** Set Chart.js `responsive: true` and `maintainAspectRatio: false`; size each chart frame in CSS with a bounded aspect ratio/height and `max-width: 100%`. Give each canvas a distinct Spanish `aria-label`. This keeps chart sizing predictable on phones while leaving Chart.js in control of the drawing surface.

7. **Degrade without disabling the existing app.** Before creating chart instances, check `window.Chart`. If absent, show a Spanish status message in the chart area and skip chart setup. Keep the existing transition matrix and prediction cards outside that area and continue updating them on state changes.

## Risks / Trade-offs

- [The CDN may be unavailable or blocked] → Check `window.Chart` and render the fallback while leaving model results and cards available.
- [A chart library upgrade may change option behavior] → Pin the requested 4.4.1 URL and cover visible axis/data behavior in browser validation.
- [Percentage conversion could be applied twice] → Have chart-data helpers return 0–100 values and keep tick callbacks limited to adding `%`; test representative values such as 0, 0.5, and 1.
- [Repeated selection changes could leak chart instances] → Update the two stored instances and verify repeated changes keep exactly two canvases and two charts.

## Migration Plan

No persisted data or migration is required. Add the CDN script and chart modules, then run `npm test` and verify the page online and with Chart.js unavailable. Rollback removes the chart script, containers, and integration; existing predictions remain unchanged.
