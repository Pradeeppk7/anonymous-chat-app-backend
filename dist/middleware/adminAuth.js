"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAuth = adminAuth;
const http_status_codes_1 = require("http-status-codes");
const adminUsername = process.env.ADMIN_USERNAME ?? "admin";
const adminPassword = process.env.ADMIN_PASSWORD;
function unauthorized(res) {
    return res
        .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
        .setHeader("WWW-Authenticate", "Basic realm=\"Admin Area\"")
        .json({ error: "Invalid admin credentials." });
}
function adminAuth(req, res, next) {
    if (!adminPassword) {
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Admin credentials are not configured." });
    }
    const authorization = req.headers.authorization;
    if (!authorization || !authorization.startsWith("Basic ")) {
        return unauthorized(res);
    }
    const encoded = authorization.slice(6);
    const decoded = Buffer.from(encoded, "base64").toString("utf-8");
    const [username, password] = decoded.split(":", 2);
    if (username !== adminUsername || password !== adminPassword) {
        return unauthorized(res);
    }
    return next();
}
