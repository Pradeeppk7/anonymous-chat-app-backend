"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listMessages = listMessages;
exports.sendMessage = sendMessage;
const http_status_codes_1 = require("http-status-codes");
const client_1 = require("../prisma/client");
const AppError_1 = require("../utils/AppError");
const groupService_1 = require("./groupService");
async function listMessages(groupCode) {
    const group = await (0, groupService_1.getActiveGroupByCode)(groupCode);
    return client_1.prisma.message.findMany({
        where: {
            groupId: group.id,
            isDeleted: false
        },
        orderBy: {
            createdAt: "asc"
        }
    });
}
async function sendMessage(groupCode, nickname, content) {
    const group = await (0, groupService_1.getActiveGroupByCode)(groupCode);
    if (typeof nickname !== "string") {
        throw new AppError_1.AppError("Nickname is required", http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
    if (typeof content !== "string") {
        throw new AppError_1.AppError("Content is required", http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
    const trimmedNickname = nickname.trim();
    const trimmedContent = content.trim();
    if (!trimmedNickname) {
        throw new AppError_1.AppError("Nickname is required", http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
    if (!trimmedContent) {
        throw new AppError_1.AppError("Content is required", http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
    return client_1.prisma.message.create({
        data: {
            groupId: group.id,
            nickname: trimmedNickname,
            content: trimmedContent
        }
    });
}
