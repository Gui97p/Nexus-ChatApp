import Fastify from "fastify";
import fjwt from "fastify-jwt";
import cors from "@fastify/cors"
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import { Server } from "socket.io";
import { registerUserRoutes } from "./modules/user/user.route";
import { registerAuthRoutes } from "./modules/auth/auth.route";
import { version } from "../package.json";
import { registerMessageRoutes } from "./modules/message/message.route";
import { setupWebSocket } from "./websockets";

const app = Fastify({
    logger: true,
});

app.get("/ping", async () => ({ message: "pong!" }));

declare module "fastify-jwt" {
  interface FastifyJWT {
    payload: { userId: string };
    user: { userId: string };
  }
}

declare module "fastify" {
  interface FastifyInstance {
    io: Server;
  }
}

app.register(swagger, {
  swagger: {
    info: {
      title: "API Nexus",
      description: "Documentação da API",
      version,
    },
    host: "localhost:3000", 
    //schemes: ["http", "ws"],
    consumes: ["application/json"],
    produces: ["application/json"],
  },
});

app.register(swaggerUI, {
  routePrefix: "/docs",
  uiConfig: {
    docExpansion: "full",
    deepLinking: false,
  },
  staticCSP: true,
});

app.register(cors, {
  origin: '*', 
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  credentials: true,
})
app.register(fjwt, {
  secret: process.env.JWT_SECRET || 'defaultsecret',
  sign: { expiresIn: "1y" },
});

app.register(setupWebSocket);

app.register(registerUserRoutes, { prefix: "/api/users" });
app.register(registerAuthRoutes, { prefix: "/api/auth" });
app.register(registerMessageRoutes, { prefix: "/api/messages" });

export default app;