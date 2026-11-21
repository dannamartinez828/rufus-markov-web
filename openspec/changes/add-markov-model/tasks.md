# Tasks

## 1. Preparar y probar las operaciones matriciales

- [ ] 1.1 Crear `package.json` como proyecto de módulos ES y configurar `npm test` para ejecutar `node --test`; verificar que el comando se inicia correctamente.
- [ ] 1.2 Implementar en `src/markov.js` los estados Aldea, Elysium, Tiempo intermedio y Apocalipsis, la matriz supuesta, su validación, la multiplicación y la potencia de matrices; añadir pruebas `node:test` para la matriz válida e inválida, multiplicación compatible e incompatible, potencias positivas y cero, y exponentes inválidos; verificar con `npm test`.

## 2. Implementar y probar las predicciones temporales

- [ ] 2.1 Implementar la distribución a n saltos desde un estado inicial; añadir pruebas para cada estado, n = 0, n negativo o no entero y estado inexistente; verificar con `npm test`.
- [ ] 2.2 Implementar una sola operación que devuelva las distribuciones para 1, 3, 5 y 10 saltos; añadir pruebas para los cuatro horizontes y que cada distribución suma 1 dentro de la precisión numérica; verificar con `npm test`.
