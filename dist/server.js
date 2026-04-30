"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = __importDefault(require("http"));
const app_1 = require("./app");
const socket_1 = require("./websocket/socket");
dotenv_1.default.config();
const PORT = Number(process.env.PORT ?? 4000);
async function bootstrap() {
    const app = await (0, app_1.createApp)();
    const server = http_1.default.createServer(app);
    (0, socket_1.initializeSocket)(server);
    server.listen(PORT, () => {
        // eslint-disable-next-line no-console
        console.log(`Anonymous Group Chat API listening on port ${PORT}`);
    });
}
bootstrap().catch((error) => {
    // eslint-disable-next-line no-console
    console.error("Failed to start server", error);
    process.exit(1);
});
