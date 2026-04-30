"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerChatHandlers = registerChatHandlers;
const messageService_1 = require("../services/messageService");
const socket_1 = require("./socket");
function registerChatHandlers(io) {
    io.on("connection", (socket) => {
        socket.on("joinGroup", (groupCode) => {
            socket.join(groupCode);
            socket.emit("joinedGroup", { groupCode });
        });
        socket.on("leaveGroup", (groupCode) => {
            socket.leave(groupCode);
            socket.emit("leftGroup", { groupCode });
        });
        socket.on("sendMessage", async (payload) => {
            try {
                const message = await (0, messageService_1.sendMessage)(payload.groupCode, payload.nickname, payload.content);
                (0, socket_1.emitNewMessage)(payload.groupCode, message);
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Failed to send message";
                socket.emit("errorMessage", { error: errorMessage });
            }
        });
    });
}
