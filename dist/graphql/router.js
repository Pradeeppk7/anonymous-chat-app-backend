"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGraphQLRouter = createGraphQLRouter;
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const express_1 = require("express");
const resolvers_1 = require("./resolvers");
const schema_1 = require("./schema");
async function createGraphQLRouter() {
    const server = new server_1.ApolloServer({
        typeDefs: schema_1.typeDefs,
        resolvers: resolvers_1.resolvers
    });
    await server.start();
    const router = (0, express_1.Router)();
    router.use((0, express4_1.expressMiddleware)(server));
    return router;
}
