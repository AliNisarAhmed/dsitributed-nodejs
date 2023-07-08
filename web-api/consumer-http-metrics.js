import Fastify from "fastify";
import fetch from "node-fetch";
import SDC from "statsd-client";
import middie from "@fastify/middie";
import v8 from "v8";
import fs from "fs";

const statsd = new SDC({ host: "localhost", port: 8125, prefix: "web-api" });

const server = Fastify({
  logger: true,
});

const HOST = process.env.HOST || "127.0.0.1";
const PORT = process.env.PORT || 3000;
const TARGET = process.env.target || "localhost:4000";

/* Docker Commands for this file
 * $ docker run -p 8080:80 -p 8125:8125/udp -it --name distnode-graphite graphiteapp/graphite-statsd:1.1.6-1
 * $ docker run -p 8000:3000 -it --name distnode-grafana grafana/grafana:6.5.2
 *
 * 8125 exposes StatsD UDP Metrics Collector
 * 8080 is the Graphite UI/API
 * 8000 is used for the Grafana UI where we create the dashboard
 */

(async () => {
  await server.register(middie);

  server.use(
    statsd.helpers.getExpressMiddleware("inbound", {
      timeByUrl: true,
    })
  );

  server.get("/", async () => {
    const begin = new Date();
    const req = await fetch(`http://${TARGET}/recipes/42`);
    statsd.timing("outbound.recipe-api.request-time", begin);
    statsd.increment("outbound.recipe-api.request-count");
    const producer_data = await req.json();

    return { consumer_pid: process.pid, producer_data };
  });

  server.get("/error", async () => {
    throw new Error("Oh no");
  });

  server.listen({ port: PORT, host: HOST }, () => {
    console.log(`Consumer running at http://${HOST}:${PORT}/`);
  });
})();

setInterval(() => {
  statsd.gauge("server.conn", server.server._connections);

  const memoryUsage = process.memoryUsage();
  statsd.gauge("server.memory.used", memoryUsage.heapUsed);
  statsd.gauge("server.memory.total", memoryUsage.heapTotal);

  const heapStats = v8.getHeapStatistics();
  statsd.gauge("server.heap.size", heapStats.used_heap_size);
  statsd.gauge("server.heap.limit", heapStats.heap_size_limit);

  fs.readdir("/proc/self/fd", (err, list) => {
    if (err) return;
    // this metric can indicate a leak in the app by counting open file descriptors
    statsd.gauge("server.descriptors", list.length);
  });

  const begin = new Date();
  setTimeout(() => {
    // this metric displays how long it takes the application to
    // call a function that was scheduled to run as early as zero ms from 
    // the time setTimeout() was called
    statsd.timing("eventlag", begin);
  }, 0);
}, 10_000);
