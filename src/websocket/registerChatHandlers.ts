import { Server } from "socket.io";

import { sendMessage } from "../services/messageService";
import { emitNewMessage } from "./socket";

type SendMessagePayload = {
  groupCode: string;
  nickname: string;
  content: string;
};

export function registerChatHandlers(io: Server) {
  io.on("connection", (socket) => {
    socket.on("joinGroup", (groupCode: string) => {
      socket.join(groupCode);
      socket.emit("joinedGroup", { groupCode });
    });

    socket.on("leaveGroup", (groupCode: string) => {
      socket.leave(groupCode);
      socket.emit("leftGroup", { groupCode });
    });

    socket.on("sendMessage", async (payload: SendMessagePayload) => {
      try {
        const message = await sendMessage(payload.groupCode, payload.nickname, payload.content);
        emitNewMessage(payload.groupCode, message);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to send message";
        socket.emit("errorMessage", { error: errorMessage });
      }
    });
  });
}
