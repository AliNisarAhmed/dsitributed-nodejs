const server = require("fastify")();
const HOST = "0.0.0.0";
const PORT = 3300;
const redis = new (require("ioredis"))({ enableOfflineQueue: false });
const pg = new (require("pg").Client)();

/* Run the following containers
 * $ docker run --rm -p 5432:5432 -e POSTGRES_PASSWORD=abc123 \
 *     -e POSTGRES_USER=tmp -e PORTGRES_DB=tmp postgres:12.3
 *
 * $ docker run --rm -p 6379:6379 redis:6.2.6
 *
 * Start health check service
 * $ PGUSER=tmp PGPASSWORD=abc123 PGDATABASE=tmp node basic-http-healthcheck.js
 *
 * Run the health check
 * $ curl -v http://localhost:3300/healthcheck
 */

pg.connect();

server.get("/health", async (req, reply) => {
  try {
    const res = await pg.query("SELECT $1::text as status", ["ACK"]);
    if (res.rows[0].status !== "ACK") {
      reply.code(500).send("DOWN");
    }
  } catch (error) {
    reply.code(500).send("DOWN");
  }

  // other down checks
  let status = "OK";
  try {
    if ((await redis.ping()) !== "PONG") {
      status = "DEGRADED";
    }
  } catch (error) {
    status = "DEGRADED";
  }

  reply.code(200).send(status);
});

server.listen({ port: PORT, host: HOST }, () =>
  console.log(`http://${HOST}:${PORT}/`)
);
