import { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { StatusCodes } from "http-status-codes";

import { AppError } from "../utils/AppError";

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: error.message
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Database request failed",
      code: error.code
    });
  }

  // eslint-disable-next-line no-console
  console.error(error);

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    error: "Internal server error"
  });
}
