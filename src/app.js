import { estados, matrizTransicion } from "./config.js";
import { resultadosPorPasos, simularRecorrido } from "./markov.js";
import {
  estadoMasProbable,
  formatearPorcentaje,
} from "./format.js";

const pasos = [1, 3, 5, 10];
const rutaAssets = new URL("../assets/img/", import.meta.url);

function rutaImagen(ruta) {
  return new URL(ruta, rutaAssets).href;
}

function obtenerElemento(selector) {
  const elemento = document.querySelector(selector);
  if (!elemento) {
    throw new Error(`No se encontró el elemento requerido: ${selector}`);
  }
  return elemento;
}

function crearImagen(ruta, textoAlternativo, ancho, alto, clase) {
  const imagen = document.createElement("img");
  imagen.src = rutaImagen(ruta);
  imagen.alt = textoAlternativo;
  imagen.width = ancho;
  imagen.height = alto;
  imagen.loading = "lazy";
  if (clase) {
    imagen.className = clase;
  }
  return imagen;
}

function crearArteEstado(estado) {
  const arte = document.createElement("div");
  arte.className = "state-art";

  arte.append(
    crearImagen(
      estado.escena,
      `Escena de fondo de ${estado.nombre}`,
      800,
      450,
      "state-art-scene",
    ),
    crearImagen(
      estado.pose,
      `Rufus en ${estado.nombre}`,
      estado.anchoPose,
      estado.altoPose,
      "state-art-pose",
    ),
  );
  return arte;
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
    radio.value = estado.nombre;
    radio.checked = indice === 0;
    radio.setAttribute(
      "aria-label",
      `Elegir ${estado.nombre} como estado inicial`,
    );
    radio.addEventListener("change", () => {
      if (radio.checked) {
        mostrarResultados(estado.nombre);
        limpiarSimulacion();
      }
    });

    const arte = crearArteEstado(estado);

    const nombre = document.createElement("span");
    nombre.className = "state-option-name";
    nombre.textContent = estado.nombre;

    const descripcion = document.createElement("span");
    descripcion.className = "state-option-description";
    descripcion.textContent = estado.descripcion;

    const contenido = document.createElement("span");
    contenido.className = "state-option-content";
    contenido.append(nombre, descripcion);

    opcion.append(radio, arte, contenido);
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
    const celda = crearCelda("th", estado.nombre);
    celda.scope = "col";
    filaEncabezado.append(celda);
  }
  encabezado.append(filaEncabezado);
  tabla.append(encabezado);

  const cuerpo = document.createElement("tbody");
  matrizTransicion.forEach((filaProbabilidades, indiceFila) => {
    const fila = document.createElement("tr");
    const encabezadoFila = crearCelda("th", estados[indiceFila].nombre);
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
        `De ${estados[indiceFila].nombre} a ${estados[indiceColumna].nombre}: ${formatearPorcentaje(probabilidad)}`,
      );
      fila.append(celda);
    });

    cuerpo.append(fila);
  });

  tabla.append(cuerpo);
  contenedor.replaceChildren(tabla);
}

function crearTarjeta(paso, distribucion) {
  const nombreProbable = estadoMasProbable(distribucion, estados);
  const estadoProbable = estados.find(
    ({ nombre }) => nombre === nombreProbable,
  );
  const tarjeta = document.createElement("article");
  tarjeta.className = "result-card";

  const titulo = document.createElement("h3");
  titulo.textContent = `Después de ${paso} ${paso === 1 ? "salto" : "saltos"}`;
  tarjeta.append(titulo);

  const destacado = document.createElement("div");
  destacado.className = "most-likely";
  destacado.append(crearArteEstado(estadoProbable));

  const nombre = document.createElement("p");
  nombre.className = "most-likely-name";
  nombre.textContent = estadoProbable.nombre;

  const etiqueta = document.createElement("p");
  etiqueta.className = "most-likely-label";
  etiqueta.textContent = "Punto temporal más probable";
  destacado.append(nombre, etiqueta);
  tarjeta.append(destacado);

  const lista = document.createElement("ul");
  lista.className = "probability-list";
  estados.forEach((estado, indice) => {
    const elemento = document.createElement("li");
    if (estado.nombre === nombreProbable) {
      elemento.classList.add("is-most-likely");
    }

    const nombreEstado = document.createElement("span");
    nombreEstado.textContent = estado.nombre;
    const porcentaje = document.createElement("strong");
    porcentaje.textContent = formatearPorcentaje(distribucion[indice]);
    elemento.append(nombreEstado, porcentaje);
    lista.append(elemento);
  });
  tarjeta.append(lista);

  return tarjeta;
}

function crearTarjetaRecorrido(nombreEstado, salto) {
  const estado = estados.find(({ nombre }) => nombre === nombreEstado);
  const tarjeta = document.createElement("article");
  tarjeta.className = "path-step";

  const titulo = document.createElement("h3");
  titulo.textContent = salto === 0 ? "Estado inicial" : `Salto ${salto}`;
  tarjeta.append(titulo, crearArteEstado(estado));

  const nombre = document.createElement("p");
  nombre.className = "path-step-name";
  nombre.textContent = estado.nombre;
  tarjeta.append(nombre);
  return tarjeta;
}

function limpiarSimulacion() {
  obtenerElemento("#simulation-count").textContent =
    "El recorrido se genera desde el estado inicial seleccionado.";
  obtenerElemento("#simulation-path").replaceChildren();
}

function mostrarSimulacion() {
  const estadoInicial = document.querySelector(
    'input[name="estado-inicial"]:checked',
  )?.value;
  if (!estadoInicial) {
    throw new Error("Selecciona un estado inicial antes de simular.");
  }

  const recorrido = simularRecorrido(estadoInicial, 10);
  const visitas = [estadoInicial, ...recorrido];
  const tarjetas = visitas.map((nombre, indice) =>
    crearTarjetaRecorrido(nombre, indice),
  );
  const reinicios = recorrido.filter((nombre) => nombre === "Reinicio").length;

  obtenerElemento("#simulation-count").textContent =
    `Reinicios: ${reinicios} de 10 saltos llegaron a Reinicio.`;
  obtenerElemento("#simulation-path").replaceChildren(...tarjetas);
}

function mostrarResultados(estadoInicial) {
  const contenedor = obtenerElemento("#result-cards");
  const resultados = resultadosPorPasos(estadoInicial);
  const tarjetas = pasos.map((paso) =>
    crearTarjeta(paso, resultados[paso]),
  );
  contenedor.replaceChildren(...tarjetas);
}

const estadoInicial = estados[0];
const imagenCabecera = obtenerElemento("#hero-rufus");
imagenCabecera.src = rutaImagen(estadoInicial.pose);
imagenCabecera.alt = `Rufus en ${estadoInicial.nombre}`;
imagenCabecera.width = estadoInicial.anchoPose;
imagenCabecera.height = estadoInicial.altoPose;

obtenerElemento("#simulate-button").addEventListener(
  "click",
  mostrarSimulacion,
);

mostrarSelector();
mostrarMatriz();
mostrarResultados(estadoInicial.nombre);
