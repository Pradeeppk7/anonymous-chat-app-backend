"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const yamljs_1 = __importDefault(require("yamljs"));
const router_1 = require("./graphql/router");
const graphqlPlaygroundRoutes_1 = require("./routes/graphqlPlaygroundRoutes");
const adminRoutes_1 = require("./routes/adminRoutes");
const groupRoutes_1 = require("./routes/groupRoutes");
const messageRoutes_1 = require("./routes/messageRoutes");
const reportRoutes_1 = require("./routes/reportRoutes");
const errorHandler_1 = require("./middleware/errorHandler");
const notFoundHandler_1 = require("./middleware/notFoundHandler");
dotenv_1.default.config();
async function createApp() {
    const app = (0, express_1.default)();
    const openApiDocument = yamljs_1.default.load(path_1.default.resolve(process.cwd(), "openapi.yaml"));
    app.use((0, cors_1.default)({
        origin: process.env.CORS_ORIGIN ?? "*"
    }));
    app.use(express_1.default.json());
    app.get("/health", (_req, res) => {
        res.status(200).json({ status: "ok" });
    });
    app.get("/openapi.yaml", (_req, res) => {
        res.sendFile(path_1.default.resolve(process.cwd(), "openapi.yaml"));
    });
    app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(openApiDocument));
    app.use("/api/groups", groupRoutes_1.groupRoutes);
    app.use("/api/groups", messageRoutes_1.messageRoutes);
    app.use("/api/messages", reportRoutes_1.reportRoutes);
    app.use("/api/admin", adminRoutes_1.adminRoutes);
    app.use("/playground", graphqlPlaygroundRoutes_1.graphqlPlaygroundRoutes);
    app.use("/graphql", await (0, router_1.createGraphQLRouter)());
    app.use(notFoundHandler_1.notFoundHandler);
    app.use(errorHandler_1.errorHandler);
    return app;
}
