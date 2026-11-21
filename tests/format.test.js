import assert from "node:assert/strict";
import test from "node:test";
import {
  estadoMasProbable,
  formatearPorcentaje,
} from "../src/format.js";

const estados = [
  { nombre: "Aldea Kuvaq" },
  { nombre: "Eliseo" },
  { nombre: "Tiempo intermedio" },
  { nombre: "Reinicio" },
];

test("formatea 0.5 exactamente como 50.0 %", () => {
  assert.equal(formatearPorcentaje(0.5), "50.0 %");
});

test("devuelve el estado con la probabilidad máxima", () => {
  assert.equal(
    estadoMasProbable([0.1, 0.65, 0.2, 0.05], estados),
    "Eliseo",
  );
});

test("resuelve empates con el primer estado en el orden recibido", () => {
  assert.equal(
    estadoMasProbable([0.4, 0.1, 0.4, 0.1], estados),
    "Aldea Kuvaq",
  );
});
