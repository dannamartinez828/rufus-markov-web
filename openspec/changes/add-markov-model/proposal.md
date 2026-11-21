# Proposal

## Why

La aplicación “Rufus en el bucle” necesita representar los saltos de Rufus entre puntos de una línea temporal inspirada en los bucles de *Deponia Doomsday*. Una cadena de Markov permite calcular probabilidades para varios horizontes desde un punto inicial, manteniendo el modelo independiente de la interfaz.

## What Changes

- Incorporar el modelo de cuatro puntos temporales y sus probabilidades de transición supuestas.
- Añadir operaciones para validar la matriz, multiplicar matrices, calcular potencias y obtener distribuciones tras n saltos.
- Permitir obtener en una sola llamada las predicciones para 1, 3, 5 y 10 saltos, con el comportamiento definido para entradas inválidas y cero saltos.
- Añadir pruebas con `node:test`, ejecutables mediante `npm test`.

## Capabilities

### New Capabilities

- `markov-prediction`: cálculo de distribuciones probabilísticas de puntos temporales de Rufus mediante una cadena de Markov.

### Modified Capabilities

Ninguna.

## Impact

- Nuevo módulo `src/markov.js`, separado de la interfaz.
- Incorporación inicial de pruebas y configuración de `npm test`; el repositorio revisado todavía no contiene `src/`, `package.json` ni pruebas.
- No se requieren dependencias externas ni cambios en una API existente.
