"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGroup = createGroup;
exports.getGroupByCode = getGroupByCode;
exports.getActiveGroupByCode = getActiveGroupByCode;
exports.listGroups = listGroups;
const http_status_codes_1 = require("http-status-codes");
const client_1 = require("../prisma/client");
const AppError_1 = require("../utils/AppError");
const generateGroupCode_1 = require("../utils/generateGroupCode");
async function generateUniqueCode() {
    for (let attempt = 0; attempt < 10; attempt += 1) {
        const groupCode = (0, generateGroupCode_1.generateGroupCode)();
        const existingGroup = await client_1.prisma.group.findUnique({
            where: { groupCode }
        });
        if (!existingGroup) {
            return groupCode;
        }
    }
    throw new AppError_1.AppError("Failed to generate a unique group code", http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
}
async function createGroup(name) {
    if (typeof name !== "string") {
        throw new AppError_1.AppError("Group name is required", http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
    const trimmedName = name.trim();
    if (!trimmedName) {
        throw new AppError_1.AppError("Group name is required", http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
    const groupCode = await generateUniqueCode();
    return client_1.prisma.group.create({
        data: {
            groupCode,
            name: trimmedName
        }
    });
}
async function getGroupByCode(groupCode) {
    const group = await client_1.prisma.group.findUnique({
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
        throw new AppError_1.AppError("Group not found", http_status_codes_1.StatusCodes.NOT_FOUND);
    }
    return group;
}
async function getActiveGroupByCode(groupCode) {
    const group = await client_1.prisma.group.findUnique({
        where: {
            groupCode
        }
    });
    if (!group || !group.isActive) {
        throw new AppError_1.AppError("Active group not found", http_status_codes_1.StatusCodes.NOT_FOUND);
    }
    return group;
}
async function listGroups() {
    return client_1.prisma.group.findMany({
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
