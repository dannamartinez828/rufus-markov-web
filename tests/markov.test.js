import assert from "node:assert/strict";
import test from "node:test";
import { estados, matrizTransicion } from "../src/config.js";
import {
  distribucionEnPasos,
  multiplicarMatrices,
  potenciaMatriz,
  resultadosPorPasos,
  validarMatriz,
} from "../src/markov.js";

test("configura los estados y las probabilidades temporales supuestas", () => {
  assert.deepEqual(estados, [
    "Aldea",
    "Elysium",
    "Tiempo intermedio",
    "Apocalipsis",
  ]);
  assert.deepEqual(matrizTransicion, [
    [0.5, 0.35, 0.05, 0.1],
    [0.05, 0.45, 0.3, 0.2],
    [0.1, 0.15, 0.55, 0.2],
    [0.6, 0.05, 0.05, 0.3],
  ]);
});

test("rechaza matrices no cuadradas", () => {
  assert.throws(() => validarMatriz([[1, 0, 0], [0, 1, 0]]), /cuadrada/);
});

test("rechaza matrices con probabilidades negativas", () => {
  assert.throws(() => validarMatriz([[1.1, -0.1], [0.5, 0.5]]), /negativas/);
});

test("rechaza filas que no suman uno", () => {
  assert.throws(() => validarMatriz([[0.8, 0.1], [0.5, 0.5]]), /sumar 1/);
});

test("acepta matrices cuadradas con filas no negativas que suman uno", () => {
  assert.equal(validarMatriz(matrizTransicion), true);
});

test("multiplica matrices con dimensiones compatibles", () => {
  assert.deepEqual(
    multiplicarMatrices([[1, 2], [3, 4]], [[5, 6], [7, 8]]),
    [[19, 22], [43, 50]],
  );
});

test("rechaza multiplicaciones con dimensiones incompatibles", () => {
  assert.throws(
    () => multiplicarMatrices([[1, 2]], [[1, 2]]),
    /dimensiones incompatibles/,
  );
});

test("eleva una matriz a una potencia positiva", () => {
  assert.deepEqual(potenciaMatriz([[1, 2], [3, 4]], 2), [[7, 10], [15, 22]]);
});

test("la potencia cero devuelve la matriz identidad", () => {
  assert.deepEqual(potenciaMatriz([[1, 2], [3, 4]], 0), [[1, 0], [0, 1]]);
});

test("rechaza exponentes negativos", () => {
  assert.throws(() => potenciaMatriz([[1]], -1), /entero no negativo/);
});

test("rechaza exponentes no enteros", () => {
  assert.throws(() => potenciaMatriz([[1]], 1.5), /entero no negativo/);
});

for (const [indice, estado] of estados.entries()) {
  test(`calcula una distribución desde ${estado}`, () => {
    const distribucion = distribucionEnPasos(estado, 1);
    assert.equal(distribucion.length, estados.length);
    assert.ok(distribucion.every((probabilidad) => probabilidad >= 0));
    assert.ok(Math.abs(distribucion.reduce((suma, p) => suma + p, 0) - 1) < 1e-10);
    assert.equal(distribucion[indice], matrizTransicion[indice][indice]);
  });
}

test("cero pasos devuelve toda la probabilidad en el estado inicial", () => {
  assert.deepEqual(distribucionEnPasos("Tiempo intermedio", 0), [0, 0, 1, 0]);
});

test("rechaza un número de pasos negativo", () => {
  assert.throws(() => distribucionEnPasos("Aldea", -1), /entero no negativo/);
});

test("rechaza un número de pasos no entero", () => {
  assert.throws(() => distribucionEnPasos("Aldea", 2.5), /entero no negativo/);
});

test("rechaza un estado inicial inexistente", () => {
  assert.throws(
    () => distribucionEnPasos("Luna", 1),
    /estado inicial "Luna" no existe/,
  );
});

test("calcula el resultado manual de una matriz de dos estados", () => {
  const distribucion = distribucionEnPasos(
    0,
    2,
    [
      [0.9, 0.1],
      [0.5, 0.5],
    ],
  );
  assert.ok(Math.abs(distribucion[0] - 0.86) < 1e-12);
  assert.ok(Math.abs(distribucion[1] - 0.14) < 1e-12);
});

test("devuelve en una llamada los resultados para 1, 3, 5 y 10 pasos", () => {
  const resultados = resultadosPorPasos("Aldea");
  assert.deepEqual(Object.keys(resultados), ["1", "3", "5", "10"]);
  assert.ok(Object.values(resultados).every((distribucion) =>
    distribucion.length === estados.length,
  ));
});

test("cada resultado agrupado suma uno para todos los estados iniciales", () => {
  for (const estado of estados) {
    const resultados = resultadosPorPasos(estado);
    for (const distribucion of Object.values(resultados)) {
      const suma = distribucion.reduce((total, probabilidad) => total + probabilidad, 0);
      assert.ok(Math.abs(suma - 1) < 1e-10, `${estado}: suma ${suma}`);
    }
  }
});
