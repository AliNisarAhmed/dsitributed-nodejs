import pg from "pg";
import Fastify from "fastify";

const db = new pg.Pool({
  host: "localhost",
  port: 5432,
  user: "user",
  password: "hunter2",
  database: "dbconn",
  max: process.env.MAX_CONN || 10,
});

db.connect();

const server = Fastify({});

server.get(
  "/",
  async () => (await db.query("SELECT NOW() AS time, 'world' AS hello")).rows[0]
);

server.listen({ port: 3000 }, () => console.log("http://localhost:3000"));
