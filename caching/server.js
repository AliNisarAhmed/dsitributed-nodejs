import fetch from "node-fetch";
import Fastify from "fastify";

import { LRUCache } from "lru-cache";

const server = Fastify({
  logger: false,
});

const lru = new LRUCache({
  max: 4096,
  maxSize: 2400,
  sizeCalculation: (value, key) => value.length + key.length,
  ttl: 10 * 60 * 1_000,
});

const PORT = process.env.PORT || 3000;

server.get("/account/:account", async (req, reply) => {
  return getAccount(req.params.account);
});

server.listen({ port: PORT }, () => console.log(`http://localhost:${PORT}`));

async function getAccount(account) {
  const cached = lru.get(account);
  if (cached) {
    console.log("cache hit");
    return JSON.parse(cached);
  }

  console.log('cache miss');
  const result = await fetch(`https://api.github.com/users/${account}`);
  const body = await result.text();
  lru.set(account, body);
  return JSON.parse(body);
}
