import { Router } from "express";

import * as reportController from "../controllers/reportController";
import { asyncHandler } from "../utils/asyncHandler";

export const reportRoutes = Router();

reportRoutes.post("/:messageId/reports", asyncHandler(reportController.createReport));
