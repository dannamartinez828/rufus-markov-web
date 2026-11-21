export function formatearPorcentaje(probabilidad) {
  if (
    typeof probabilidad !== "number" ||
    !Number.isFinite(probabilidad) ||
    probabilidad < 0 ||
    probabilidad > 1
  ) {
    throw new Error("La probabilidad debe ser un número entre 0 y 1.");
  }

  return `${(probabilidad * 100).toFixed(1)} %`;
}

export function estadoMasProbable(distribucion, estados) {
  if (
    !Array.isArray(distribucion) ||
    !Array.isArray(estados) ||
    distribucion.length === 0 ||
    distribucion.length !== estados.length
  ) {
    throw new Error("La distribución y los estados deben tener la misma longitud no vacía.");
  }

  if (
    distribucion.some(
      (probabilidad) =>
        typeof probabilidad !== "number" || !Number.isFinite(probabilidad),
    )
  ) {
    throw new Error("La distribución debe contener solo números finitos.");
  }

  let indiceMayor = 0;
  for (let indice = 1; indice < distribucion.length; indice += 1) {
    if (distribucion[indice] > distribucion[indiceMayor]) {
      indiceMayor = indice;
    }
  }

  return estados[indiceMayor];
}
