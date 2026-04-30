import { Router } from "express";
import playground from "graphql-playground-middleware-express";

export const graphqlPlaygroundRoutes = Router();

graphqlPlaygroundRoutes.get(
  "/",
  playground({
    endpoint: "/graphql"
  })
);
