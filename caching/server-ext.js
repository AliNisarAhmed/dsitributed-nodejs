import fetch from "node-fetch";
import Fastify from "fastify";
import memjs from "memjs";

const memcache = memjs.Client.create("localhost:11211");

const server = Fastify({
  logger: false,
});

const PORT = process.env.PORT || 3000;

server.get("/account/:account", async (req, reply) => {
  return getAccount(req.params.account);
});

server.listen({ port: PORT }, () => console.log(`http://localhost:${PORT}`));

async function getAccount(account) {
  const { value: cached } = await memcache.get(account);
  if (cached) {
    console.log("cache hit");
    return JSON.parse(cached);
  }

  console.log("cache miss");

  const result = await fetch(`https://api.github.com/users/${account}`);
  const body = await result.text();
  await memcache.set(account, body, {});
  return JSON.parse(body);
}
