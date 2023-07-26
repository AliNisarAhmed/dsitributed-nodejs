import Redis from "ioredis";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const redis = new Redis("localhost:6379");

redis.defineCommand("adduser", {
  numberOfKeys: 2,
  lua: fs.readFileSync(__dirname + "/add-user.lua"),
});

const LOBBY = "lobby";
const GAME = "game";

(async () => {
  console.log(await redis.adduser(LOBBY, GAME, "alice")); // null
  console.log(await redis.adduser(LOBBY, GAME, "bob")); // null
  console.log(await redis.adduser(LOBBY, GAME, "cindy")); // null
  const [gameId, players] = await redis.adduser(LOBBY, GAME, "azlan");
  console.log("GAME ID: ", gameId, "PLAYERS: ", players.split(","));
  redis.quit();
})();
