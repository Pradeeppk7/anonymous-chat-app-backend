import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import * as adminService from "../services/adminService";
import * as groupService from "../services/groupService";
import * as reportService from "../services/reportService";
import { parseInteger } from "../utils/parseInteger";

export async function listGroups(_req: Request, res: Response) {
  const groups = await groupService.listGroups();
  return res.status(StatusCodes.OK).json(groups);
}

export async function listReports(_req: Request, res: Response) {
  const reports = await reportService.listReports();
  return res.status(StatusCodes.OK).json(reports);
}

export async function deleteMessage(req: Request, res: Response) {
  const message = await adminService.deleteMessage(
    parseInteger(req.params.messageId, "messageId"),
    req.body?.reason
  );
  return res.status(StatusCodes.OK).json(message);
}

export async function deleteGroup(req: Request, res: Response) {
  const group = await adminService.deleteGroup(parseInteger(req.params.groupId, "groupId"), req.body?.reason);
  return res.status(StatusCodes.OK).json(group);
}
