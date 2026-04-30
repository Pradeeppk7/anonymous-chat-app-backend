import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

import { createGraphQLRouter } from "./graphql/router";
import { graphqlPlaygroundRoutes } from "./routes/graphqlPlaygroundRoutes";
import { adminRoutes } from "./routes/adminRoutes";
import { groupRoutes } from "./routes/groupRoutes";
import { messageRoutes } from "./routes/messageRoutes";
import { reportRoutes } from "./routes/reportRoutes";
import { errorHandler } from "./middleware/errorHandler";
import { notFoundHandler } from "./middleware/notFoundHandler";

dotenv.config();

export async function createApp() {
  const app = express();
  const openApiDocument = YAML.load(path.resolve(process.cwd(), "openapi.yaml"));

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN ?? "*"
    })
  );
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  app.get("/openapi.yaml", (_req, res) => {
    res.sendFile(path.resolve(process.cwd(), "openapi.yaml"));
  });
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

  app.use("/api/groups", groupRoutes);
  app.use("/api/groups", messageRoutes);
  app.use("/api/messages", reportRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/playground", graphqlPlaygroundRoutes);
  app.use("/graphql", await createGraphQLRouter());

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
