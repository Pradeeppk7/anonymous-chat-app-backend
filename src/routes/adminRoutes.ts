import { Router } from "express";

import * as adminController from "../controllers/adminController";
import { asyncHandler } from "../utils/asyncHandler";

export const adminRoutes = Router();

adminRoutes.get("/groups", asyncHandler(adminController.listGroups));
adminRoutes.get("/reports", asyncHandler(adminController.listReports));
adminRoutes.delete("/messages/:messageId", asyncHandler(adminController.deleteMessage));
adminRoutes.delete("/groups/:groupId", asyncHandler(adminController.deleteGroup));
