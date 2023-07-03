import { promisify } from "util";
import { loadPackageDefinition, credentials } from "@grpc/grpc-js";
import Fastify from "fastify";
import { loadSync } from "@grpc/proto-loader";

import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = Fastify();
const pkg_def = loadSync(__dirname + "/../shared/grpc-recipe.proto");

const recipe = loadPackageDefinition(pkg_def).recipe;

const HOST = "127.0.0.1";
const PORT = process.env.PORT || 3000;
const TARGET = process.env.TARGET || "localhost:4000";

const client = new recipe.RecipeService(TARGET, credentials.createInsecure());

const getMetaData = promisify(client.getMetaData.bind(client));
const getRecipe = promisify(client.getRecipe.bind(client));

server.get("/", async () => {
  const [meta, recipe] = await Promise.all([
    getMetaData({}),
    getRecipe({ id: 42 }),
  ]);

  return {
    consumer_pid: process.pid,
    producer_data: meta,
    recipe,
  };
});

server.listen({ port: PORT, host: HOST }, () => {
  console.log(`Consumer running at http://${HOST}:${PORT}/`);
});
