"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const client_1 = require("../prisma/client");
const adminService = __importStar(require("../services/adminService"));
const groupService = __importStar(require("../services/groupService"));
const messageService = __importStar(require("../services/messageService"));
const reportService = __importStar(require("../services/reportService"));
const socket_1 = require("../websocket/socket");
exports.resolvers = {
    Query: {
        groups: async () => groupService.listGroups(),
        group: async (_parent, args) => groupService.getGroupByCode(args.groupCode),
        messages: async (_parent, args) => messageService.listMessages(args.groupCode),
        reports: async () => reportService.listReports()
    },
    Mutation: {
        createGroup: async (_parent, args) => groupService.createGroup(args.name),
        sendMessage: async (_parent, args) => {
            const message = await messageService.sendMessage(args.groupCode, args.nickname, args.content);
            (0, socket_1.emitNewMessage)(args.groupCode, message);
            return message;
        },
        reportMessage: async (_parent, args) => reportService.reportMessage(args.messageId, args.reason),
        deleteMessage: async (_parent, args) => adminService.deleteMessage(args.messageId, args.reason),
        deleteGroup: async (_parent, args) => adminService.deleteGroup(args.groupId, args.reason),
        activateGroup: async (_parent, args) => adminService.activateGroup(args.groupId, args.reason),
        hardDeleteGroup: async (_parent, args) => adminService.hardDeleteGroup(args.groupId, args.reason)
    },
    Group: {
        messages: async (parent) => client_1.prisma.message.findMany({
            where: {
                groupId: parent.id,
                isDeleted: false
            },
            orderBy: {
                createdAt: "asc"
            }
        })
    },
    Message: {
        reports: async (parent) => client_1.prisma.report.findMany({
            where: {
                messageId: parent.id
            },
            orderBy: {
                createdAt: "desc"
            }
        })
    },
    Report: {
        message: async (parent) => client_1.prisma.message.findUnique({
            where: {
                id: parent.messageId
            }
        })
    }
};
