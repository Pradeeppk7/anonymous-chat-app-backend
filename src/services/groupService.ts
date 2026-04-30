import { Group } from "@prisma/client";
import { StatusCodes } from "http-status-codes";

import { prisma } from "../prisma/client";
import { AppError } from "../utils/AppError";
import { generateGroupCode } from "../utils/generateGroupCode";

async function generateUniqueCode() {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const groupCode = generateGroupCode();
    const existingGroup = await prisma.group.findUnique({
      where: { groupCode }
    });

    if (!existingGroup) {
      return groupCode;
    }
  }

  throw new AppError("Failed to generate a unique group code", StatusCodes.INTERNAL_SERVER_ERROR);
}

export async function createGroup(name: string): Promise<Group> {
  if (typeof name !== "string") {
    throw new AppError("Group name is required", StatusCodes.BAD_REQUEST);
  }

  const trimmedName = name.trim();

  if (!trimmedName) {
    throw new AppError("Group name is required", StatusCodes.BAD_REQUEST);
  }

  const groupCode = await generateUniqueCode();

  return prisma.group.create({
    data: {
      groupCode,
      name: trimmedName
    }
  });
}

export async function getGroupByCode(groupCode: string) {
  const group = await prisma.group.findUnique({
    where: {
      groupCode
    },
    include: {
      _count: {
        select: {
          messages: true
        }
      }
    }
  });

  if (!group) {
    throw new AppError("Group not found", StatusCodes.NOT_FOUND);
  }

  return group;
}

export async function getActiveGroupByCode(groupCode: string) {
  const group = await prisma.group.findUnique({
    where: {
      groupCode
    }
  });

  if (!group || !group.isActive) {
    throw new AppError("Active group not found", StatusCodes.NOT_FOUND);
  }

  return group;
}

export async function listGroups() {
  return prisma.group.findMany({
    orderBy: {
      createdAt: "desc"
    },
    include: {
      _count: {
        select: {
          messages: true
        }
      }
    }
  });
}
