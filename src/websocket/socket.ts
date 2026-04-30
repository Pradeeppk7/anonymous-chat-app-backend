import { Message } from "@prisma/client";
import { Server as HttpServer } from "http";
import { Server } from "socket.io";

import { registerChatHandlers } from "./registerChatHandlers";

let io: Server | null = null;

export function initializeSocket(server: HttpServer) {
  io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN ?? "*"
    }
  });

  registerChatHandlers(io);

  return io;
}

export function emitNewMessage(groupCode: string, message: Message) {
  io?.to(groupCode).emit("newMessage", message);
}
