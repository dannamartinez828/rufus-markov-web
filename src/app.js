import { estados, matrizTransicion } from "./config.js";
import { resultadosPorPasos } from "./markov.js";
import {
  estadoMasProbable,
  formatearPorcentaje,
} from "./format.js";

const imagenesPorEstado = Object.freeze({
  Aldea: "/assets/img/Kuvaq.png",
  Elysium: "/assets/img/elysium.jpg",
  "Tiempo intermedio": "/assets/img/intermedio.png",
  Apocalipsis: "/assets/img/apocalipsis.jpg",
});
const pasos = [1, 3, 5, 10];

function obtenerElemento(selector) {
  const elemento = document.querySelector(selector);
  if (!elemento) {
    throw new Error(`No se encontró el elemento requerido: ${selector}`);
  }
  return elemento;
}

function crearCelda(etiqueta, texto, clase) {
  const celda = document.createElement(etiqueta);
  if (clase) {
    celda.className = clase;
  }
  celda.textContent = texto;
  return celda;
}

function mostrarSelector() {
  const contenedor = obtenerElemento("#state-options");
  const opciones = document.createDocumentFragment();

  estados.forEach((estado, indice) => {
    const id = `estado-inicial-${indice}`;
    const opcion = document.createElement("label");
    opcion.className = "state-option";

    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "estado-inicial";
    radio.id = id;
    radio.value = estado;
    radio.checked = indice === 0;
    radio.setAttribute("aria-label", estado);
    radio.addEventListener("change", () => {
      if (radio.checked) {
        mostrarResultados(estado);
      }
    });

    const imagen = document.createElement("img");
    imagen.src = imagenesPorEstado[estado];
    imagen.alt = `Rufus en ${estado}`;
    imagen.loading = "lazy";

    const nombre = document.createElement("span");
    nombre.className = "state-option-name";
    nombre.textContent = estado;

    opcion.append(radio, imagen, nombre);
    opciones.append(opcion);
  });

  contenedor.replaceChildren(opciones);
}

function mostrarMatriz() {
  const contenedor = obtenerElemento("#transition-table");
  const tabla = document.createElement("table");
  tabla.className = "transition-matrix";

  const caption = document.createElement("caption");
  caption.textContent = "Probabilidades del siguiente salto";
  tabla.append(caption);

  const encabezado = document.createElement("thead");
  const filaEncabezado = document.createElement("tr");
  filaEncabezado.append(
    crearCelda("th", "Estado actual ↓ / siguiente →", "matrix-axis"),
  );
  filaEncabezado.lastElementChild.scope = "col";

  for (const estado of estados) {
    const celda = crearCelda("th", estado);
    celda.scope = "col";
    filaEncabezado.append(celda);
  }
  encabezado.append(filaEncabezado);
  tabla.append(encabezado);

  const cuerpo = document.createElement("tbody");
  matrizTransicion.forEach((filaProbabilidades, indiceFila) => {
    const fila = document.createElement("tr");
    const encabezadoFila = crearCelda("th", estados[indiceFila]);
    encabezadoFila.scope = "row";
    fila.append(encabezadoFila);

    filaProbabilidades.forEach((probabilidad, indiceColumna) => {
      const celda = crearCelda(
        "td",
        formatearPorcentaje(probabilidad),
        "probability-cell",
      );
      celda.style.setProperty(
        "--cell-intensity",
        String(0.12 + probabilidad * 0.48),
      );
      celda.setAttribute(
        "aria-label",
        `De ${estados[indiceFila]} a ${estados[indiceColumna]}: ${formatearPorcentaje(probabilidad)}`,
      );
      fila.append(celda);
    });

    cuerpo.append(fila);
  });

  tabla.append(cuerpo);
  contenedor.replaceChildren(tabla);
}

function crearTarjeta(paso, distribucion) {
  const estadoProbable = estadoMasProbable(distribucion, estados);
  const tarjeta = document.createElement("article");
  tarjeta.className = "result-card";

  const titulo = document.createElement("h3");
  titulo.textContent = `Después de ${paso} ${paso === 1 ? "salto" : "saltos"}`;
  tarjeta.append(titulo);

  const destacado = document.createElement("div");
  destacado.className = "most-likely";

  const imagen = document.createElement("img");
  imagen.src = imagenesPorEstado[estadoProbable];
  imagen.alt = `Rufus en ${estadoProbable}`;
  imagen.loading = "lazy";

  const nombre = document.createElement("p");
  nombre.className = "most-likely-name";
  nombre.textContent = estadoProbable;

  const etiqueta = document.createElement("p");
  etiqueta.className = "most-likely-label";
  etiqueta.textContent = "Punto temporal más probable";
  destacado.append(imagen, nombre, etiqueta);
  tarjeta.append(destacado);

  const lista = document.createElement("ul");
  lista.className = "probability-list";
  estados.forEach((estado, indice) => {
    const elemento = document.createElement("li");
    if (estado === estadoProbable) {
      elemento.classList.add("is-most-likely");
    }

    const nombreEstado = document.createElement("span");
    nombreEstado.textContent = estado;
    const porcentaje = document.createElement("strong");
    porcentaje.textContent = formatearPorcentaje(distribucion[indice]);
    elemento.append(nombreEstado, porcentaje);
    lista.append(elemento);
  });
  tarjeta.append(lista);

  return tarjeta;
}

function mostrarResultados(estadoInicial) {
  const contenedor = obtenerElemento("#result-cards");
  const resultados = resultadosPorPasos(estadoInicial);
  const tarjetas = pasos.map((paso) =>
    crearTarjeta(paso, resultados[paso]),
  );
  contenedor.replaceChildren(...tarjetas);
}

mostrarSelector();
mostrarMatriz();
mostrarResultados(estados[0]);
