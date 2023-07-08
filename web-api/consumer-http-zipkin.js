import Fastify from "fastify";
import fetch from "node-fetch";
import Zipkin from "zipkin-lite";

/* Run zipkin on Docker with the following command
 * docker run -p 9411:9411 -it --name distnode-zipkin openzipkin/zipkin-slim:2.19
 */

const HOST = process.env.HOST || "127.0.0.1";
const PORT = process.env.PORT || 3000;
const TARGET = process.env.target || "localhost:4000";
const ZIPKIN = process.env.ZIPKIN || "localhost:9411";
const zipkin = new Zipkin({
  zipkinHost: ZIPKIN,
  serviceName: "web-api",
  servicePort: PORT,
  serviceIp: HOST,
  // init flag indicates that this service is the root service 
  init: "short",
});

const server = Fastify({
  logger: true,
});

server.addHook("onRequest", zipkin.onRequest());
server.addHook("onResponse", zipkin.onResponse());

server.get("/", async (req) => {
  req.zipkin.setName("get_root");

  const url = `http://${TARGET}/recipes/42`;
  const zreq = req.zipkin.prepare();
  const recipe = await fetch(url, { headers: zreq.headers });
  zreq.complete("GET", url);

  const producer_data = await recipe.json();

  return {
    pid: process.pid,
    producer_data,
    trace: req.zipkin.trace,
  };
});

server.listen({ port: PORT, host: HOST }, () => {
  console.log(`Consumer running at http://${HOST}:${PORT}/`);
});
