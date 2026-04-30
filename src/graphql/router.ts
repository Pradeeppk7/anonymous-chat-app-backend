import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { Router } from "express";

import { resolvers } from "./resolvers";
import { typeDefs } from "./schema";

export async function createGraphQLRouter() {
  const server = new ApolloServer({
    typeDefs,
    resolvers
  });

  await server.start();

  const router = Router();
  router.use(expressMiddleware(server));
  return router;
}
