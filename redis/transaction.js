import Redis from "ioredis";
const redis = new Redis("localhost:6379");

(async () => {
  const [res_srem, res_hdel] = await redis
    .multi()
    .srem("employees", "42") // Remove from set
    .hdel("employee-42", "company-id") // Delete from Hash
    .exec();

  console.log("srem?: ", !!res_srem[1], "hdel?: ", !!res_hdel[1]);
  redis.quit();
})();

// Run the following commands before running this script
// docker run -it --rm --name distnode-redis -p 6379:6379 redis:6.2.6-alpine
// docker exec distnode-redis redis-cli SADD employees 42 tlhunter
// docker exec distnode-redis redis-cli HSET employee-42 company-id funcorp

