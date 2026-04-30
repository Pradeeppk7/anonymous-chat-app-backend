"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
exports.typeDefs = `#graphql
  type Group {
    id: Int!
    groupCode: String!
    name: String!
    isActive: Boolean!
    createdAt: String!
    messages: [Message!]!
  }

  type Message {
    id: Int!
    groupId: Int!
    nickname: String!
    content: String!
    isDeleted: Boolean!
    createdAt: String!
    reports: [Report!]!
  }

  type Report {
    id: Int!
    messageId: Int!
    reason: String!
    status: String!
    createdAt: String!
  }

  type Query {
    groups: [Group!]!
    group(groupCode: String!): Group
    messages(groupCode: String!): [Message!]!
    reports: [Report!]!
  }

  type Mutation {
    createGroup(name: String!): Group!
    sendMessage(groupCode: String!, nickname: String!, content: String!): Message!
    reportMessage(messageId: Int!, reason: String!): Report!
    deleteMessage(messageId: Int!, reason: String): Message!
    deleteGroup(groupId: Int!, reason: String): Group!
  }
`;
