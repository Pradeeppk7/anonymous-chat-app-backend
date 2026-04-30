"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMessage = deleteMessage;
exports.deleteGroup = deleteGroup;
exports.activateGroup = activateGroup;
exports.hardDeleteGroup = hardDeleteGroup;
const http_status_codes_1 = require("http-status-codes");
const client_1 = require("../prisma/client");
const AppError_1 = require("../utils/AppError");
function normalizeReason(reason) {
    const trimmedReason = reason?.trim();
    return trimmedReason && trimmedReason.length > 0 ? trimmedReason : "No reason provided";
}
async function deleteMessage(messageId, reason) {
    const message = await client_1.prisma.message.findUnique({
        where: {
            id: messageId
        }
    });
    if (!message) {
        throw new AppError_1.AppError("Message not found", http_status_codes_1.StatusCodes.NOT_FOUND);
    }
    if (message.isDeleted) {
        return message;
    }
    return client_1.prisma.$transaction(async (tx) => {
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
async function deleteGroup(groupId, reason) {
    const group = await client_1.prisma.group.findUnique({
        where: {
            id: groupId
        }
    });
    if (!group) {
        throw new AppError_1.AppError("Group not found", http_status_codes_1.StatusCodes.NOT_FOUND);
    }
    if (!group.isActive) {
        return group;
    }
    return client_1.prisma.$transaction(async (tx) => {
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
async function activateGroup(groupId, reason) {
    const group = await client_1.prisma.group.findUnique({
        where: {
            id: groupId
        }
    });
    if (!group) {
        throw new AppError_1.AppError("Group not found", http_status_codes_1.StatusCodes.NOT_FOUND);
    }
    if (group.isActive) {
        return group;
    }
    return client_1.prisma.$transaction(async (tx) => {
        const updatedGroup = await tx.group.update({
            where: {
                id: groupId
            },
            data: {
                isActive: true
            }
        });
        await tx.adminAction.create({
            data: {
                actionType: "activate",
                targetType: "group",
                targetId: groupId,
                reason: normalizeReason(reason)
            }
        });
        return updatedGroup;
    });
}
async function hardDeleteGroup(groupId, reason) {
    const group = await client_1.prisma.group.findUnique({
        where: {
            id: groupId
        }
    });
    if (!group) {
        throw new AppError_1.AppError("Group not found", http_status_codes_1.StatusCodes.NOT_FOUND);
    }
    return client_1.prisma.$transaction(async (tx) => {
        const deletedGroup = await tx.group.delete({
            where: {
                id: groupId
            }
        });
        await tx.adminAction.create({
            data: {
                actionType: "hard-delete",
                targetType: "group",
                targetId: groupId,
                reason: normalizeReason(reason)
            }
        });
        return deletedGroup;
    });
}
