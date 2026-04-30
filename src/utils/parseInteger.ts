import { StatusCodes } from "http-status-codes";

import { AppError } from "./AppError";

export function parseInteger(value: string, fieldName: string) {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new AppError(`${fieldName} must be a positive integer`, StatusCodes.BAD_REQUEST);
  }

  return parsed;
}
