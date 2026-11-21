import assert from "node:assert/strict";
import test from "node:test";
import { estados, matrizTransicion } from "../src/config.js";
import {
  distribucionEnPasos,
  multiplicarMatrices,
  potenciaMatriz,
  resultadosPorPasos,
  simularRecorrido,
  validarMatriz,
} from "../src/markov.js";

test("configura los estados y las probabilidades temporales supuestas", () => {
  assert.deepEqual(estados.map(({ nombre }) => nombre), [
    "Aldea Kuvaq",
    "Eliseo",
    "Tiempo intermedio",
    "Reinicio",
  ]);
  assert.deepEqual(
    estados.map(
      ({ nombre, descripcion, escena, pose, anchoPose, altoPose }) => ({
        nombre,
        descripcion,
        escena,
        pose,
        anchoPose,
        altoPose,
      }),
    ),
    [
      {
        nombre: "Aldea Kuvaq",
        descripcion:
          "El pueblo de Rufus en Deponia. Aquí despierta al inicio de cada bucle, recordando todo.",
        escena: "escenas/kuvaq.jpg",
        pose: "rufus/aldea.png",
        anchoPose: 227,
        altoPose: 360,
      },
      {
        nombre: "Eliseo",
        descripcion:
          "La ciudad flotante. Rufus viaja hasta aquí con el profesor McChronicle, antes de que se estrelle.",
        escena: "escenas/eliseo.jpg",
        pose: "rufus/eliseo.gif",
        anchoPose: 180,
        altoPose: 360,
      },
      {
        nombre: "Tiempo intermedio",
        descripcion:
          "Un espacio de agujeros de gusano que conecta todas las líneas temporales.",
        escena: "escenas/intermedio.jpg",
        pose: "rufus/intermedio.png",
        anchoPose: 180,
        altoPose: 360,
      },
      {
        nombre: "Reinicio",
        descripcion:
          "El mundo se destruye y el tiempo vuelve atrás. Solo Rufus, el profesor McChronicle y Tuck conservan la memoria.",
        escena: "escenas/reinicio.jpg",
        pose: "rufus/reinicio.png",
        anchoPose: 272,
        altoPose: 360,
      },
    ],
  );
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

for (const [indice, { nombre: estado }] of estados.entries()) {
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
  assert.throws(  () => distribucionEnPasos("Aldea Kuvaq", -1), /entero no negativo/);
});

test("rechaza un número de pasos no entero", () => {
  assert.throws(  () => distribucionEnPasos("Aldea Kuvaq", 2.5), /entero no negativo/);
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
  const resultados = resultadosPorPasos("Aldea Kuvaq");
  assert.deepEqual(Object.keys(resultados), ["1", "3", "5", "10"]);
  assert.ok(Object.values(resultados).every((distribucion) =>
    distribucion.length === estados.length,
  ));
});

test("cada resultado agrupado suma uno para todos los estados iniciales", () => {
  for (const { nombre: estado } of estados) {
    const resultados = resultadosPorPasos(estado);
    for (const distribucion of Object.values(resultados)) {
      const suma = distribucion.reduce((total, probabilidad) => total + probabilidad, 0);
      assert.ok(Math.abs(suma - 1) < 1e-10, `${estado}: suma ${suma}`);
    }
  }
});

test("simula exactamente la cantidad de saltos solicitada", () => {
  const recorrido = simularRecorrido("Aldea Kuvaq", 10);
  assert.equal(recorrido.length, 10);
  assert.ok(recorrido.every((estado) => estados.some(({ nombre }) => nombre === estado)));
});

test("cero saltos devuelve un recorrido vacío", () => {
  assert.deepEqual(simularRecorrido("Aldea Kuvaq", 0), []);
});

test("un valor aleatorio de cero elige la primera transición posible", () => {
  assert.deepEqual(
    simularRecorrido("Aldea Kuvaq", 4, () => 0),
    Array(4).fill("Aldea Kuvaq"),
  );
});

test("un valor aleatorio de 0.99 elige la última transición posible", () => {
  assert.deepEqual(
    simularRecorrido("Aldea Kuvaq", 4, () => 0.99),
    Array(4).fill("Reinicio"),
  );
});

test("rechaza estados iniciales inexistentes en la simulación", () => {
  assert.throws(
    () => simularRecorrido("Luna", 1),
    /estado inicial "Luna" no existe/,
  );
});

test("rechaza cantidades negativas y no enteras de saltos", () => {
  assert.throws(
    () => simularRecorrido("Aldea Kuvaq", -1),
    /entero no negativo/,
  );
  assert.throws(
    () => simularRecorrido("Aldea Kuvaq", 1.5),
    /entero no negativo/,
  );
});

test("rechaza valores inválidos del generador aleatorio", () => {
  assert.throws(
    () => simularRecorrido("Aldea Kuvaq", 1, () => 1),
    /devolver un número entre 0 y 1/,
  );
});
