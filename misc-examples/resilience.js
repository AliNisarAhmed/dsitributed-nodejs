// Exponential backoff
import Redis from "ioredis";
const DEFAULT = 5000;
const SCHEDULE = [100, 250, 500, 1000, 2500];
const redis = new Redis({
  retryStrategy: (times) => SCHEDULE[times] || DEFAULT,
});

// an HTTP retry schedule may look more like this: [10, 20, 40, quit]
// especially if we are calling an upstream service as part of a request from downstream service

// To avoid Thudering herd (where all downstream services call a server at once), we can introduce jitter
// Jitter is random variance, such as an increase or decrease of request timing of +-10%

const redis2 = new Redis({
  retryStrategy: (times) => {
    let time = SCHEDULE[times] || DEFAULT;
    return Math.random() * (time * 0.2) + time * 0.9; // +-10%
  },
});

// CHAOS Testing

// Random crashes

if (process.env.NODE_ENV === "staging") {
  const LIFESPAN = Math.random() * 100_000_000; // 0 - 30 hours
  setTimeout(() => {
    console.error("chaos exit");
    process.exit(99);
  }, LIFESPAN);
}

// Event loop Pauses
const TIMER = 100_000;
function slow() {
  fibonacci(1_000_000n);
  setTimeout(slow, Math.random() * TIMER);
}
setTimeout(slow, Math.random() * TIMER);

// Random failed Async Operations
const THRESHOLD = 10_000;
async function chaosQuery(query) {
  if (math.random() * THRESHOLD <= 1) {
    throw new Error("chaos query");
  }
  return db.query(query);
}
const result = await chaosQuery("SELECT foo FROM bar LIMIT 1");
return result.rows[0];
