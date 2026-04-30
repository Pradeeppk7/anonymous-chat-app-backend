import { StatusCodes } from "http-status-codes";

import { prisma } from "../prisma/client";
import { AppError } from "../utils/AppError";

export async function reportMessage(messageId: number, reason: string) {
  if (typeof reason !== "string") {
    throw new AppError("Reason is required", StatusCodes.BAD_REQUEST);
  }

  const trimmedReason = reason.trim();

  if (!trimmedReason) {
    throw new AppError("Reason is required", StatusCodes.BAD_REQUEST);
  }

  const message = await prisma.message.findUnique({
    where: {
      id: messageId
    }
  });

  if (!message || message.isDeleted) {
    throw new AppError("Message not found", StatusCodes.NOT_FOUND);
  }

  return prisma.report.create({
    data: {
      messageId,
      reason: trimmedReason
    }
  });
}

export async function listReports() {
  return prisma.report.findMany({
    where: {
      message: {
        isDeleted: false
      }
    },
    orderBy: {
      createdAt: "desc"
    },
    include: {
      message: true
    }
  });
}
