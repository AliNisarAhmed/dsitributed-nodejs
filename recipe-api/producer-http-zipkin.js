#!/usr/bin/env node

const server = require("fastify")({
  logger: true,
});

const HOST = process.env.HOST || "127.0.0.1";
const PORT = process.env.PORT || 4000;
const ZIPKIN = process.env.ZIPKIN || 'localhost:9411';

console.log(`worker pid=${process.pod}`);

const Zipkin = require('zipkin-lite');
const zipkin = new Zipkin({
  zipkinHost: ZIPKIN,
  serviceName: 'recipe-api',
  servicePort: PORT,
  serviceIp: HOST
});

server.addHook('onRequest', zipkin.onRequest());
server.addHook('onResponse', zipkin.onResponse());

server.get("/recipes/:id", async (req, reply) => {
  req.zipkin.setName('get_recipe');
  const id = Number(req.params.id);
  if (id !== 42) {
    reply.statusCode = 404;
    return { error: "not_found" };
  }

  return {
    producer_pid: process.pid,
    recipe: {
      id,
      name: "Chicken Tikka Masala",
      steps: "Throw in in a pot...",
      ingredients: [
        { id: 1, name: "Chicken", quantity: "1 lb" },
        { id: 2, name: "Sauce", quantity: "2 cups" },
      ],
    },
  };
});

server.listen({ port: PORT, host: HOST }, () => {
  console.log(`Producer running at http://${HOST}:${PORT}`);
});
