"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseInteger = parseInteger;
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = require("./AppError");
function parseInteger(value, fieldName) {
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed < 1) {
        throw new AppError_1.AppError(`${fieldName} must be a positive integer`, http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
    return parsed;
}
