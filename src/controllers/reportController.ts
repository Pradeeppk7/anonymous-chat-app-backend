import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import * as reportService from "../services/reportService";
import { parseInteger } from "../utils/parseInteger";

export async function createReport(req: Request, res: Response) {
  const report = await reportService.reportMessage(
    parseInteger(req.params.messageId, "messageId"),
    req.body.reason
  );
  return res.status(StatusCodes.CREATED).json(report);
}
