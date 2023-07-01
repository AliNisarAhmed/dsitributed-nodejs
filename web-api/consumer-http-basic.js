import Fastify from 'fastify';
import fetch from 'node-fetch';

const server = Fastify({
  logger: true,
});
const HOST = process.env.HOST || "127.0.0.1";
const PORT = process.env.PORT || 3000;
const TARGET = process.env.target || "localhost:4000";

server.get("/", async () => {
  const req = await fetch(`http://${TARGET}/recipes/42`);
  const producer_data = await req.json();

  return {
    consumer_pid: process.pid,
    producer_data,
  };
});

server.listen({ port: PORT, host: HOST }, () => {
  console.log(`Consumer running at http://${HOST}:${PORT}/`);
});
