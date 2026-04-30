declare module "graphql-playground-middleware-express" {
  import { RequestHandler } from "express";

  export default function playground(options: { endpoint: string }): RequestHandler;
}
