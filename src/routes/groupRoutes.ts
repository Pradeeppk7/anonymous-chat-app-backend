import { Router } from "express";

import * as groupController from "../controllers/groupController";
import { asyncHandler } from "../utils/asyncHandler";

export const groupRoutes = Router();

groupRoutes.post("/", asyncHandler(groupController.createGroup));
groupRoutes.get("/:groupCode", asyncHandler(groupController.getGroup));
