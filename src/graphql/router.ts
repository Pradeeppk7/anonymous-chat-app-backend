import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { Router } from "express";

import { resolvers } from "./resolvers";
import { typeDefs } from "./schema";
import { authenticateAdmin } from "../middleware/adminAuth";

export async function createGraphQLRouter() {
  const server = new ApolloServer({
    typeDefs,
    resolvers
  });

  await server.start();

  const router = Router();
  router.use(expressMiddleware(server, {
    context: async ({ req }) => {
      // For admin operations, authenticate if headers present
      let admin = null;
      try {
        const authorization = req.headers.authorization;
        if (authorization && authorization.startsWith("Basic ")) {
          const encoded = authorization.slice(6);
          const decoded = Buffer.from(encoded, "base64").toString("utf-8");
          const [username, password] = decoded.split(":", 2);
          if (username && password) {
            admin = await authenticateAdmin(username, password);
          }
        }
      } catch (e) {
        // Ignore auth errors for non-admin queries
      }
      return { admin };
    }
  }));
  return router;
}
