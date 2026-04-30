"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSocket = initializeSocket;
exports.emitNewMessage = emitNewMessage;
const socket_io_1 = require("socket.io");
const registerChatHandlers_1 = require("./registerChatHandlers");
let io = null;
function initializeSocket(server) {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: process.env.CORS_ORIGIN ?? "*"
        }
    });
    (0, registerChatHandlers_1.registerChatHandlers)(io);
    return io;
}
function emitNewMessage(groupCode, message) {
    io?.to(groupCode).emit("newMessage", message);
}
