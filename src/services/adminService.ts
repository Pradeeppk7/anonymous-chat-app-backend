import { StatusCodes } from "http-status-codes";

import { prisma } from "../prisma/client";
import { AppError } from "../utils/AppError";

function normalizeReason(reason?: string) {
  const trimmedReason = reason?.trim();
  return trimmedReason && trimmedReason.length > 0 ? trimmedReason : "No reason provided";
}

export async function deleteMessage(messageId: number, reason?: string) {
  const message = await prisma.message.findUnique({
    where: {
      id: messageId
    }
  });

  if (!message) {
    throw new AppError("Message not found", StatusCodes.NOT_FOUND);
  }

  if (message.isDeleted) {
    return message;
  }

  return prisma.$transaction(async (tx) => {
    const updatedMessage = await tx.message.update({
      where: {
        id: messageId
      },
      data: {
        isDeleted: true
      }
    });

    await tx.adminAction.create({
      data: {
        actionType: "delete",
        targetType: "message",
        targetId: messageId,
        reason: normalizeReason(reason)
      }
    });

    return updatedMessage;
  });
}

export async function deleteGroup(groupId: number, reason?: string) {
  const group = await prisma.group.findUnique({
    where: {
      id: groupId
    }
  });

  if (!group) {
    throw new AppError("Group not found", StatusCodes.NOT_FOUND);
  }

  if (!group.isActive) {
    return group;
  }

  return prisma.$transaction(async (tx) => {
    const updatedGroup = await tx.group.update({
      where: {
        id: groupId
      },
      data: {
        isActive: false
      }
    });

    await tx.adminAction.create({
      data: {
        actionType: "delete",
        targetType: "group",
        targetId: groupId,
        reason: normalizeReason(reason)
      }
    });

    return updatedGroup;
  });
}
