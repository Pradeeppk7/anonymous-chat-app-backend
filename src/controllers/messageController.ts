import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import * as messageService from "../services/messageService";
import { emitNewMessage } from "../websocket/socket";

export async function listMessages(req: Request, res: Response) {
  const messages = await messageService.listMessages(req.params.groupCode);
  return res.status(StatusCodes.OK).json(messages);
}

export async function createMessage(req: Request, res: Response) {
  const message = await messageService.sendMessage(
    req.params.groupCode,
    req.body.nickname,
    req.body.content
  );

  emitNewMessage(req.params.groupCode, message);

  return res.status(StatusCodes.CREATED).json(message);
}
