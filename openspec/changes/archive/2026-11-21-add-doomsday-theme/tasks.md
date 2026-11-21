# Tasks

## 1. Update temporal state data and model

- [x] 1.1 Verify that all four scene and four Rufus pose files exist at the specified `assets/img/` paths; pause for clarification if any are missing rather than substituting or creating assets.
- [x] 1.2 Update `src/config.js` with the four renamed state objects, exact descriptions and image paths, preserving the existing transition matrix; verify names, metadata and unchanged matrix values in `tests/markov.test.js`.
- [x] 1.3 Adapt `src/markov.js` to resolve the renamed state names and implement `simularRecorrido` with weighted sampling and input validation; add focused tests for exact path length, zero/invalid jumps, missing initial state and injected random values `0` and `0.99`, then run `node --test tests/markov.test.js`.

## 2. Adapt presentation formatting

- [x] 2.1 Update `src/format.js` and `tests/format.test.js` for state metadata objects while retaining percentage formatting; verify the maximum state name and first-in-order tie behavior with `node --test tests/format.test.js`.

## 3. Serve JPEG scenes

- [x] 3.1 Update `src/server.js` to serve `.jpg` as `image/jpeg` and add a focused HTTP test for a scene response with status 200 and the correct content type; run that test with `node --test tests/server.test.js`.

## 4. Update page content and interactions

- [x] 4.1 Update `index.html` and `src/app.js` with the Aldea Kuvaq header pose, metadata-backed state selector and results, character cards, reading guide and “Simular 10 saltos” interaction; verify state changes refresh all four horizons and the simulator shows the initial state plus ten transitions and the Reinicio arrival count.

## 5. Style the expanded interface

- [x] 5.1 Update `src/styles.css` for layered scenes and poses, new content sections and the simulator while retaining responsive Deponia styling; verify all sections, image alternatives and readable layouts at mobile and desktop widths.

## 6. Verify integration

- [x] 6.1 Run `npm test` and `npm start`; verify the page loads at `http://localhost:8000`, the requested `.jpg` responds with HTTP 200 and `image/jpeg`, and changing the initial state updates predictions without recalculating the model in the UI.
