import { Router } from "express";

import * as messageController from "../controllers/messageController";
import { asyncHandler } from "../utils/asyncHandler";

export const messageRoutes = Router();

messageRoutes.get("/:groupCode/messages", asyncHandler(messageController.listMessages));
messageRoutes.post("/:groupCode/messages", asyncHandler(messageController.createMessage));
