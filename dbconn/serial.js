import pg from "pg";

const db = new pg.Client({
  host: "localhost",
  port: 5432,
  user: "user",
  password: "hunter2",
  database: "dbconn",
});

// Uncomment the code below to compare pool vs single connection
//
// const db = new pg.Pool({
//   host: "localhost",
//   port: 5432,
//   user: "user",
//   password: "hunter2",
//   database: "dbconn",
// });

// Single conn: 4.022 seconds
// Pool (2 connections): 2.017 seconds

db.connect();

(async () => {
  const start = Date.now();

  await Promise.all([
    db.query("SELECT pg_sleep(2);"),
    db.query("SELECT pg_sleep(2);"),
  ]);

  console.log(`took ${(Date.now() - start) / 1000} seconds`);
  db.end();
})();
