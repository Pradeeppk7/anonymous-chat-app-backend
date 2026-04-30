import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { authenticateAdmin } from "../services/adminService";

function unauthorized(res: Response) {
  return res
    .status(StatusCodes.UNAUTHORIZED)
    .setHeader("WWW-Authenticate", "Basic realm=\"Admin Area\"")
    .json({ error: "Invalid admin credentials." });
}

export async function adminAuth(req: Request, res: Response, next: NextFunction) {
  const authorization = req.headers.authorization;
  if (!authorization || !authorization.startsWith("Basic ")) {
    return unauthorized(res);
  }

  const encoded = authorization.slice(6);
  const decoded = Buffer.from(encoded, "base64").toString("utf-8");
  const [username, password] = decoded.split(":", 2);

  if (!username || !password) {
    return unauthorized(res);
  }

  try {
    await authenticateAdmin(username, password);
    return next();
  } catch (error) {
    return unauthorized(res);
  }
}

export { authenticateAdmin };
