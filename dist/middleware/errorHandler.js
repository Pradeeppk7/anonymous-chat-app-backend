"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const client_1 = require("@prisma/client");
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = require("../utils/AppError");
function errorHandler(error, _req, res, _next) {
    if (error instanceof AppError_1.AppError) {
        return res.status(error.statusCode).json({
            error: error.message
        });
    }
    if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            error: "Database request failed",
            code: error.code
        });
    }
    // eslint-disable-next-line no-console
    console.error(error);
    return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: "Internal server error"
    });
}
