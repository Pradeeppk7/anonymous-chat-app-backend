import { Message } from "@prisma/client";
import { StatusCodes } from "http-status-codes";

import { prisma } from "../prisma/client";
import { AppError } from "../utils/AppError";
import { getActiveGroupByCode } from "./groupService";

export async function listMessages(groupCode: string) {
  const group = await getActiveGroupByCode(groupCode);

  return prisma.message.findMany({
    where: {
      groupId: group.id,
      isDeleted: false
    },
    orderBy: {
      createdAt: "asc"
    }
  });
}

export async function sendMessage(groupCode: string, nickname: string, content: string): Promise<Message> {
  const group = await getActiveGroupByCode(groupCode);

  if (typeof nickname !== "string") {
    throw new AppError("Nickname is required", StatusCodes.BAD_REQUEST);
  }

  if (typeof content !== "string") {
    throw new AppError("Content is required", StatusCodes.BAD_REQUEST);
  }

  const trimmedNickname = nickname.trim();
  const trimmedContent = content.trim();

  if (!trimmedNickname) {
    throw new AppError("Nickname is required", StatusCodes.BAD_REQUEST);
  }

  if (!trimmedContent) {
    throw new AppError("Content is required", StatusCodes.BAD_REQUEST);
  }

  return prisma.message.create({
    data: {
      groupId: group.id,
      nickname: trimmedNickname,
      content: trimmedContent
    }
  });
}
