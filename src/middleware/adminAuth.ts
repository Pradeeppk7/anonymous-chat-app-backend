import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const adminUsername = process.env.ADMIN_USERNAME ?? "admin";
const adminPassword = process.env.ADMIN_PASSWORD;

function unauthorized(res: Response) {
  return res
    .status(StatusCodes.UNAUTHORIZED)
    .setHeader("WWW-Authenticate", "Basic realm=\"Admin Area\"")
    .json({ error: "Invalid admin credentials." });
}

export function adminAuth(req: Request, res: Response, next: NextFunction) {
  if (!adminPassword) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Admin credentials are not configured." });
  }

  const authorization = req.headers.authorization;
  if (!authorization || !authorization.startsWith("Basic ")) {
    return unauthorized(res);
  }

  const encoded = authorization.slice(6);
  const decoded = Buffer.from(encoded, "base64").toString("utf-8");
  const [username, password] = decoded.split(":", 2);

  if (username !== adminUsername || password !== adminPassword) {
    return unauthorized(res);
  }

  return next();
}
