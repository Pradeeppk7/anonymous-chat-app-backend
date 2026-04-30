import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import * as groupService from "../services/groupService";

export async function createGroup(req: Request, res: Response) {
  const group = await groupService.createGroup(req.body.name);
  return res.status(StatusCodes.CREATED).json(group);
}

export async function getGroup(req: Request, res: Response) {
  const group = await groupService.getGroupByCode(req.params.groupCode);
  return res.status(StatusCodes.OK).json(group);
}
