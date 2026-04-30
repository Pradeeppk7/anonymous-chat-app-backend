"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.graphqlPlaygroundRoutes = void 0;
const express_1 = require("express");
const graphql_playground_middleware_express_1 = __importDefault(require("graphql-playground-middleware-express"));
exports.graphqlPlaygroundRoutes = (0, express_1.Router)();
exports.graphqlPlaygroundRoutes.get("/", (0, graphql_playground_middleware_express_1.default)({
    endpoint: "/graphql"
}));
