import { prisma } from "../prisma/client";
import * as adminService from "../services/adminService";
import * as groupService from "../services/groupService";
import * as messageService from "../services/messageService";
import * as reportService from "../services/reportService";
import { emitNewMessage } from "../websocket/socket";

export const resolvers = {
  Query: {
    groups: async () => groupService.listGroups(),
    group: async (_parent: unknown, args: { groupCode: string }) =>
      groupService.getGroupByCode(args.groupCode),
    messages: async (_parent: unknown, args: { groupCode: string }) =>
      messageService.listMessages(args.groupCode),
    reports: async () => reportService.listReports()
  },
  Mutation: {
    createGroup: async (_parent: unknown, args: { name: string }) => groupService.createGroup(args.name),
    sendMessage: async (
      _parent: unknown,
      args: { groupCode: string; nickname: string; content: string }
    ) => {
      const message = await messageService.sendMessage(args.groupCode, args.nickname, args.content);
      emitNewMessage(args.groupCode, message);
      return message;
    },
    reportMessage: async (_parent: unknown, args: { messageId: number; reason: string }) =>
      reportService.reportMessage(args.messageId, args.reason),
    deleteMessage: async (_parent: unknown, args: { messageId: number; reason?: string }) =>
      adminService.deleteMessage(args.messageId, args.reason),
    deleteGroup: async (_parent: unknown, args: { groupId: number; reason?: string }) =>
      adminService.deleteGroup(args.groupId, args.reason),
    activateGroup: async (_parent: unknown, args: { groupId: number; reason?: string }) =>
      adminService.activateGroup(args.groupId, args.reason)
  },
  Group: {
    messages: async (parent: { id: number }) =>
      prisma.message.findMany({
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
    reports: async (parent: { id: number }) =>
      prisma.report.findMany({
        where: {
          messageId: parent.id
        },
        orderBy: {
          createdAt: "desc"
        }
      })
  },
  Report: {
    message: async (parent: { messageId: number }) =>
      prisma.message.findUnique({
        where: {
          id: parent.messageId
        }
      })
  }
};
