import { readFile } from "node:fs/promises";
import { createServer as createHttpServer } from "node:http";
import { extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(fileURLToPath(new URL("../", import.meta.url)));
const host = "127.0.0.1";
const port = 8000;
const mimeTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".gif", "image/gif"],
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
]);

function respond(response, status, message) {
  response.writeHead(status, {
    "content-type": "text/plain; charset=utf-8",
    "x-content-type-options": "nosniff",
  });
  response.end(message);
}

export function createAppServer() {
  return createHttpServer(async (request, response) => {
    if (request.method !== "GET" && request.method !== "HEAD") {
      response.setHeader("allow", "GET, HEAD");
      respond(response, 405, "Método no permitido.");
      return;
    }

    let pathname;
    try {
      pathname = decodeURIComponent(
        new URL(request.url ?? "/", `http://${host}`).pathname,
      );
    } catch {
      respond(response, 400, "La ruta solicitada no es válida.");
      return;
    }

    let filePath;
    if (pathname === "/" || pathname === "/index.html") {
      filePath = resolve(projectRoot, "index.html");
    } else {
      const segmentos = pathname.split("/").filter(Boolean);
      const directorio = segmentos[0];
      if (directorio !== "src" && directorio !== "assets") {
        respond(response, 404, "No se encontró el recurso solicitado.");
        return;
      }

      const directorioPermitido = resolve(projectRoot, directorio);
      filePath = resolve(projectRoot, pathname.slice(1));
      if (
        filePath !== directorioPermitido &&
        !filePath.startsWith(`${directorioPermitido}${sep}`)
      ) {
        respond(response, 403, "La ruta solicitada no está permitida.");
        return;
      }
    }

    const contentType = mimeTypes.get(extname(filePath).toLowerCase());
    if (!contentType) {
      respond(response, 404, "No se encontró el recurso solicitado.");
      return;
    }

    let content;
    try {
      content = await readFile(filePath);
    } catch (error) {
      if (error.code === "ENOENT" || error.code === "EISDIR") {
        respond(response, 404, "No se encontró el recurso solicitado.");
        return;
      }
      console.error("No se pudo leer el recurso solicitado:", error);
      respond(response, 500, "No se pudo leer el recurso solicitado.");
      return;
    }

    response.writeHead(200, {
      "content-length": content.length,
      "content-type": contentType,
      "x-content-type-options": "nosniff",
    });
    response.end(request.method === "HEAD" ? undefined : content);
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const server = createAppServer();
  server.on("error", (error) => {
    console.error("No se pudo iniciar el servidor local:", error);
    process.exitCode = 1;
  });

  server.listen(port, host, () => {
    console.log(`Aplicación disponible en http://${host}:${port}`);
  });
}
