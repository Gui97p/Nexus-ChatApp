"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
require("dotenv/config");
const fastify_1 = __importDefault(require("fastify"));
const fastify_jwt_1 = __importDefault(require("fastify-jwt"));
const cors_1 = __importDefault(require("@fastify/cors"));
const swagger_1 = __importDefault(require("@fastify/swagger"));
const swagger_ui_1 = __importDefault(require("@fastify/swagger-ui"));
const user_route_1 = require("./modules/user/user.route");
const auth_route_1 = require("./modules/auth/auth.route");
const package_json_1 = require("../package.json");
exports.app = (0, fastify_1.default)({
    logger: true,
});
const port = Number(process.env.PORT) || 3000;
exports.app.get("/ping", async () => ({ message: "pong!" }));
exports.app.register(swagger_1.default, {
    swagger: {
        info: {
            title: "API Nexus",
            description: "Documentação da API",
            version: package_json_1.version,
        },
        host: "localhost:3000",
        //schemes: ["http", "ws"],
        consumes: ["application/json"],
        produces: ["application/json"],
    },
});
exports.app.register(swagger_ui_1.default, {
    routePrefix: "/docs",
    uiConfig: {
        docExpansion: "full",
        deepLinking: false,
    },
    staticCSP: true,
});
async function main() {
    try {
        exports.app.register(cors_1.default, {
            origin: '*',
            methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
            credentials: true,
        });
        exports.app.register(fastify_jwt_1.default, {
            secret: process.env.JWT_SECRET || 'defaultsecret',
            sign: { expiresIn: "30d" },
        });
        exports.app.register(user_route_1.registerUserRoutes, { prefix: "/api/users" });
        exports.app.register(auth_route_1.registerAuthRoutes, { prefix: "/api/auth" });
        await exports.app.listen({ port, host: "0.0.0.0" });
    }
    catch (err) {
        exports.app.log.error(err);
        process.exit(1);
    }
}
main();
