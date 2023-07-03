const server = require("fastify")();
const mercurius = require("mercurius");
const fs = require("fs");
const schema = fs
  .readFileSync(__dirname + "/../shared/graphql-schema.gql")
  .toString();
const HOST = process.env.HOST || "127.0.0.1";
const PORT = process.env.PORT || 4000;

const resolvers = {
  Query: {
    pid: () => process.pid,
    recipe: async (_obj, { id }) => {
      if (Number(id) !== 42) throw new Error(`recipe ${id} not found`);
      return {
        id,
        name: "Chicken Tikka Masala",
        steps: "Throw it in a pot...",
      };
    },
  },
  Recipe: {
    ingredients: async (obj) => {
      return Number(obj.id) !== 42
        ? []
        : [
            { id: 1, name: "Chicken", quantity: "1 lb" },
            { id: 2, name: "Sauce", quantity: "2 cups" },
          ];
    },
  },
};

server
  .register(mercurius, { schema, resolvers, graphiql: true })
  .listen({ port: PORT, host: HOST }, () => {
    console.log(`Producer running at http://${HOST}:${PORT}/graphql`);
  });
