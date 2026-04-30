"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGraphQLRouter = createGraphQLRouter;
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const express_1 = require("express");
const resolvers_1 = require("./resolvers");
const schema_1 = require("./schema");
const adminAuth_1 = require("../middleware/adminAuth");
async function createGraphQLRouter() {
    const server = new server_1.ApolloServer({
        typeDefs: schema_1.typeDefs,
        resolvers: resolvers_1.resolvers
    });
    await server.start();
    const router = (0, express_1.Router)();
    router.use((0, express4_1.expressMiddleware)(server, {
        context: async ({ req }) => {
            // For admin operations, authenticate if headers present
            let admin = null;
            try {
                const authorization = req.headers.authorization;
                if (authorization && authorization.startsWith("Basic ")) {
                    const encoded = authorization.slice(6);
                    const decoded = Buffer.from(encoded, "base64").toString("utf-8");
                    const [username, password] = decoded.split(":", 2);
                    if (username && password) {
                        admin = await (0, adminAuth_1.authenticateAdmin)(username, password);
                    }
                }
            }
            catch (e) {
                // Ignore auth errors for non-admin queries
            }
            return { admin };
        }
    }));
    return router;
}
