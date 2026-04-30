"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = notFoundHandler;
const http_status_codes_1 = require("http-status-codes");
function notFoundHandler(_req, res) {
    return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
        error: "Route not found"
    });
}
