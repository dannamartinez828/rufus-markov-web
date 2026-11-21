import { estados, matrizTransicion } from "./config.js";

const TOLERANCIA_SUMA = 1e-10;
const PASOS_REQUERIDOS = Object.freeze([1, 3, 5, 10]);

function dimensionesMatriz(matriz) {
  if (!Array.isArray(matriz) || matriz.length === 0) {
    throw new Error("La matriz debe ser un arreglo no vacío.");
  }

  if (!Array.isArray(matriz[0]) || matriz[0].length === 0) {
    throw new Error("La matriz debe tener filas no vacías.");
  }

  const columnas = matriz[0].length;

  for (const fila of matriz) {
    if (!Array.isArray(fila) || fila.length !== columnas) {
      throw new Error("Todas las filas de la matriz deben tener la misma longitud.");
    }

    for (const valor of fila) {
      if (typeof valor !== "number" || !Number.isFinite(valor)) {
        throw new Error("Todos los elementos de la matriz deben ser números finitos.");
      }
    }
  }

  return { filas: matriz.length, columnas };
}

function validarEnteroNoNegativo(n, nombre) {
  if (!Number.isInteger(n) || n < 0) {
    throw new Error(`${nombre} debe ser un entero no negativo.`);
  }
}

export function validarMatriz(matriz) {
  const { filas, columnas } = dimensionesMatriz(matriz);

  if (filas !== columnas) {
    throw new Error("La matriz de transición debe ser cuadrada.");
  }

  for (const [indice, fila] of matriz.entries()) {
    if (fila.some((valor) => valor < 0)) {
      throw new Error(`La fila ${indice} contiene probabilidades negativas.`);
    }

    const suma = fila.reduce((total, valor) => total + valor, 0);
    if (Math.abs(suma - 1) > TOLERANCIA_SUMA) {
      throw new Error(`La fila ${indice} debe sumar 1.`);
    }
  }

  return true;
}

export function multiplicarMatrices(matrizA, matrizB) {
  const dimensionesA = dimensionesMatriz(matrizA);
  const dimensionesB = dimensionesMatriz(matrizB);

  if (dimensionesA.columnas !== dimensionesB.filas) {
    throw new Error("No se pueden multiplicar matrices con dimensiones incompatibles.");
  }

  return Array.from({ length: dimensionesA.filas }, (_, fila) =>
    Array.from({ length: dimensionesB.columnas }, (_, columna) =>
      matrizA[fila].reduce(
        (suma, valor, indice) => suma + valor * matrizB[indice][columna],
        0,
      ),
    ),
  );
}

export function potenciaMatriz(matriz, n) {
  const { filas, columnas } = dimensionesMatriz(matriz);
  if (filas !== columnas) {
    throw new Error("Solo se pueden elevar matrices cuadradas.");
  }
  validarEnteroNoNegativo(n, "El exponente");

  let exponente = n;
  let base = matriz.map((fila) => [...fila]);
  let resultado = Array.from({ length: filas }, (_, fila) =>
    Array.from({ length: filas }, (_, columna) => Number(fila === columna)),
  );

  while (exponente > 0) {
    if (exponente % 2 === 1) {
      resultado = multiplicarMatrices(resultado, base);
    }
    exponente = Math.floor(exponente / 2);
    if (exponente > 0) {
      base = multiplicarMatrices(base, base);
    }
  }

  return resultado;
}

export function distribucionEnPasos(
  estadoInicial,
  n,
  matriz = matrizTransicion,
) {
  validarEnteroNoNegativo(n, "El número de pasos");
  validarMatriz(matriz);

  const indiceEstado =
    typeof estadoInicial === "string"
      ? estados.findIndex(({ nombre }) => nombre === estadoInicial)
      : estadoInicial;

  if (
    !Number.isInteger(indiceEstado) ||
    indiceEstado < 0 ||
    indiceEstado >= matriz.length
  ) {
    throw new Error(`El estado inicial "${estadoInicial}" no existe.`);
  }

  const vectorInicial = Array.from(
    { length: matriz.length },
    (_, indice) => Number(indice === indiceEstado),
  );
  return multiplicarMatrices([vectorInicial], potenciaMatriz(matriz, n))[0];
}

export function resultadosPorPasos(
  estadoInicial,
  matriz = matrizTransicion,
) {
  return Object.fromEntries(
    PASOS_REQUERIDOS.map((n) => [
      n,
      distribucionEnPasos(estadoInicial, n, matriz),
    ]),
  );
}

export function simularRecorrido(
  estadoInicial,
  saltos,
  aleatorio = Math.random,
) {
  validarEnteroNoNegativo(saltos, "El número de saltos");

  const indiceInicial =
    typeof estadoInicial === "string"
      ? estados.findIndex(({ nombre }) => nombre === estadoInicial)
      : -1;
  if (indiceInicial < 0) {
    throw new Error(`El estado inicial "${estadoInicial}" no existe.`);
  }
  if (typeof aleatorio !== "function") {
    throw new Error("El generador aleatorio debe ser una función.");
  }

  let indiceActual = indiceInicial;
  const recorrido = [];

  for (let salto = 0; salto < saltos; salto += 1) {
    const fila = matrizTransicion[indiceActual];
    const valorAleatorio = aleatorio();
    if (
      typeof valorAleatorio !== "number" ||
      !Number.isFinite(valorAleatorio) ||
      valorAleatorio < 0 ||
      valorAleatorio >= 1
    ) {
      throw new Error("El generador aleatorio debe devolver un número entre 0 y 1.");
    }

    const sumaFila = fila.reduce((suma, probabilidad) => suma + probabilidad, 0);
    const objetivo = valorAleatorio * sumaFila;
    let acumulado = 0;
    let siguienteIndice = -1;

    for (let indice = 0; indice < fila.length; indice += 1) {
      acumulado += fila[indice];
      if (fila[indice] > 0 && objetivo < acumulado) {
        siguienteIndice = indice;
        break;
      }
    }

    if (siguienteIndice < 0) {
      for (let indice = fila.length - 1; indice >= 0; indice -= 1) {
        if (fila[indice] > 0) {
          siguienteIndice = indice;
          break;
        }
      }
    }

    if (siguienteIndice < 0) {
      throw new Error("La fila de transición no contiene probabilidades positivas.");
    }

    indiceActual = siguienteIndice;
    recorrido.push(estados[indiceActual].nombre);
  }

  return recorrido;
}
