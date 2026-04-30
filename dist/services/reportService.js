"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportMessage = reportMessage;
exports.listReports = listReports;
const http_status_codes_1 = require("http-status-codes");
const client_1 = require("../prisma/client");
const AppError_1 = require("../utils/AppError");
async function reportMessage(messageId, reason) {
    if (typeof reason !== "string") {
        throw new AppError_1.AppError("Reason is required", http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
    const trimmedReason = reason.trim();
    if (!trimmedReason) {
        throw new AppError_1.AppError("Reason is required", http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
    const message = await client_1.prisma.message.findUnique({
        where: {
            id: messageId
        }
    });
    if (!message || message.isDeleted) {
        throw new AppError_1.AppError("Message not found", http_status_codes_1.StatusCodes.NOT_FOUND);
    }
    return client_1.prisma.report.create({
        data: {
            messageId,
            reason: trimmedReason
        }
    });
}
async function listReports() {
    return client_1.prisma.report.findMany({
        orderBy: {
            createdAt: "desc"
        },
        include: {
            message: true
        }
    });
}
