import { DatabaseReconnection } from "./db.js";
import Fastify from "fastify";

const server = Fastify({});

// start postgres docker with the following command
// docker run --name distnode-postgres -it --rm -p 5432:5432 -e POSTGRES_PASSWORD=hunter2 -e POSTGRES_USER=user -e POSTGRES_DB=dbconn postgres:12.3
  
const db = new DatabaseReconnection({
  host: "localhost",
  port: 5432,
  user: "user",
  password: "hunter2",
  database: "dbconn",
  retry: 1_000,
});

db.connect();
db.on("error", (err) => console.log("db error", err.message));
db.on("reconnect", () => console.log("reconnecting..."));
db.on("connect", () => console.log("connected"));
db.on("disconnect", () => console.log("disconnected"));

server.get("/foo/:foo_id", async (req, reply) => {
  let res;
  try {
    res = await db.query("SELECT NOW() AS time, $1 AS echo", [
      req.params.foo_id,
    ]);
  } catch (error) {
    reply.statusCode = 503;
    return error;
  }

  return res.rows[0];
});

server.get("/health", async (req, reply) => {
  if (!db.connected) {
    throw new Error("no db connection");
  }

  return "OK";
});

server.listen({ port: 3000 }, () => console.log("http://localhost:3000"));
