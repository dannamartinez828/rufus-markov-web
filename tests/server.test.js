import assert from "node:assert/strict";
import { request } from "node:http";
import test from "node:test";
import { createAppServer } from "../src/server.js";

test("sirve escenas JPG con estado 200 y tipo image/jpeg", async (t) => {
  const server = createAppServer();
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });

  t.after(
    () =>
      new Promise((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      }),
  );

  const { port } = server.address();
  const response = await new Promise((resolve, reject) => {
    const requestStream = request(
      {
        hostname: "127.0.0.1",
        port,
        path: "/assets/img/escenas/kuvaq.jpg",
        method: "GET",
      },
      (incomingResponse) => {
        incomingResponse.resume();
        resolve(incomingResponse);
      },
    );
    requestStream.once("error", reject);
    requestStream.end();
  });

  assert.equal(response.statusCode, 200);
  assert.equal(response.headers["content-type"], "image/jpeg");
});
