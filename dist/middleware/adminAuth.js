"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateAdmin = void 0;
exports.adminAuth = adminAuth;
const http_status_codes_1 = require("http-status-codes");
const adminService_1 = require("../services/adminService");
Object.defineProperty(exports, "authenticateAdmin", { enumerable: true, get: function () { return adminService_1.authenticateAdmin; } });
function unauthorized(res) {
    return res
        .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
        .setHeader("WWW-Authenticate", "Basic realm=\"Admin Area\"")
        .json({ error: "Invalid admin credentials." });
}
async function adminAuth(req, res, next) {
    const authorization = req.headers.authorization;
    if (!authorization || !authorization.startsWith("Basic ")) {
        return unauthorized(res);
    }
    const encoded = authorization.slice(6);
    const decoded = Buffer.from(encoded, "base64").toString("utf-8");
    const [username, password] = decoded.split(":", 2);
    if (!username || !password) {
        return unauthorized(res);
    }
    try {
        await (0, adminService_1.authenticateAdmin)(username, password);
        return next();
    }
    catch (error) {
        return unauthorized(res);
    }
}
