export const estados = Object.freeze([
  "Aldea",
  "Elysium",
  "Tiempo intermedio",
  "Apocalipsis",
]);

export const matrizTransicion = Object.freeze([
  Object.freeze([0.5, 0.35, 0.05, 0.1]),
  Object.freeze([0.05, 0.45, 0.3, 0.2]),
  Object.freeze([0.1, 0.15, 0.55, 0.2]),
  Object.freeze([0.6, 0.05, 0.05, 0.3]),
]);
