# Design

## Context

See `proposal.md` for motivation. The current app separates model data, Markov logic, presentation formatting, browser UI, and a small static server. The change spans those modules but does not add a framework, dependency, or persisted data.

## Goals / Non-Goals

**Goals:**
- Keep state metadata, transition rows, and UI references aligned by one stable state order.
- Keep simulation randomness injectable so model tests can verify exact paths without a browser.
- Make scene and pose imagery accessible while preserving the requested layered presentation.

**Non-Goals:**
- Change transition probabilities or add a new prediction algorithm.
- Add persistence, external services, or a graphics/charting library.
- Reconstruct or create image assets.

## Decisions

1. **Represent states as metadata objects in `src/config.js`.** Each object has `nombre`, `descripcion`, `escena`, and `pose`; image paths are relative to `assets/img/`. Keep the transition matrix in the same state order and retain its exact values. This keeps content out of the Markov implementation and gives the interface one source for labels and images. An alternative was to maintain separate name, description, and image arrays, but that could drift out of alignment.

2. **Preserve index-based matrix calculations and resolve names at the model boundary.** Existing prediction functions continue using the ordered states and matrix; public operations that accept an initial state resolve its `nombre` to the corresponding matrix index. `estadoMasProbable` returns the selected object's `nombre`, so the UI and existing formatter tests receive a display-ready label.

3. **Implement `simularRecorrido` as cumulative weighted sampling.** For each transition, multiply the injected random value by the row's total probability and select the first cumulative probability that exceeds the sample. With valid stochastic rows this selects the first possible state for 0 and the last possible state for 0.99. Return only the states reached after transitions; the UI adds the selected initial state to the displayed path. This keeps the model API's result length equal to `saltos`.

4. **Count Reinicios as arrivals during the simulated transitions.** Count entries equal to “Reinicio” in the returned path, excluding the initial state, and label the displayed value as the number of transitions that arrived at Reinicio. This avoids counting the starting selection as an event.

5. **Render scenes and poses as layered image elements.** Use a scene `<img>` as the card background layer and a pose `<img>` above it, with Spanish `alt` text and `loading="lazy"` on both. Use the same approach for state cards and the simulator path; the header uses the Aldea Kuvaq pose with Spanish `alt` text and lazy loading. Layered elements are preferred over CSS-only background images because both images need accessible alternatives.

6. **Keep the simulator and predictions connected to the existing model.** `src/app.js` calls `resultadosPorPasos` for the four prediction horizons and calls `simularRecorrido` only when the simulation button is activated. Presentation helpers in `src/format.js` remain browser-independent.

7. **Extend the existing static server MIME map for `.jpg`.** Serve JPEG scenes as `image/jpeg` without changing the existing `npm start` command or introducing a server dependency.

## Risks / Trade-offs

- [The requested asset paths may differ from the repository's current files] → Verify the four scene and four pose paths before wiring the UI; do not generate replacement assets or silently fall back to another image.
- [Metadata objects change the shape of the exported state collection] → Update model/UI call sites and both existing test files together, while preserving state order and matrix values.
- [A sampler can mishandle zero-probability entries or cumulative boundaries] → Use cumulative weighted selection and deterministic tests for injected values 0 and 0.99 across transitions.
- [Layered imagery can become hard to read on small screens] → Keep text content separate from the images and verify responsive layout and contrast at mobile and desktop widths.

## Migration Plan

There is no persisted state or data migration. Update configuration, model, UI, and tests together, then verify the app using `npm test` and `npm start`. Rollback consists of reverting the change's code and asset references; no external service or database state is affected.
