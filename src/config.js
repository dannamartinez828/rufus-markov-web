export const estados = Object.freeze([
  Object.freeze({
    nombre: "Aldea Kuvaq",
    descripcion:
      "El pueblo de Rufus en Deponia. Aquí despierta al inicio de cada bucle, recordando todo.",
    escena: "escenas/kuvaq.jpg",
    pose: "rufus/aldea.png",
    anchoPose: 227,
    altoPose: 360,
  }),
  Object.freeze({
    nombre: "Eliseo",
    descripcion:
      "La ciudad flotante. Rufus viaja hasta aquí con el profesor McChronicle, antes de que se estrelle.",
    escena: "escenas/eliseo.jpg",
    pose: "rufus/eliseo.gif",
    anchoPose: 180,
    altoPose: 360,
  }),
  Object.freeze({
    nombre: "Tiempo intermedio",
    descripcion:
      "Un espacio de agujeros de gusano que conecta todas las líneas temporales.",
    escena: "escenas/intermedio.jpg",
    pose: "rufus/intermedio.png",
    anchoPose: 180,
    altoPose: 360,
  }),
  Object.freeze({
    nombre: "Reinicio",
    descripcion:
      "El mundo se destruye y el tiempo vuelve atrás. Solo Rufus, el profesor McChronicle y Tuck conservan la memoria.",
    escena: "escenas/reinicio.jpg",
    pose: "rufus/reinicio.png",
    anchoPose: 272,
    altoPose: 360,
  }),
]);

export const matrizTransicion = Object.freeze([
  Object.freeze([0.5, 0.35, 0.05, 0.1]),
  Object.freeze([0.05, 0.45, 0.3, 0.2]),
  Object.freeze([0.1, 0.15, 0.55, 0.2]),
  Object.freeze([0.6, 0.05, 0.05, 0.3]),
]);
