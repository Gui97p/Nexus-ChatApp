import "dotenv/config";
import Fastify from "fastify";
import fjwt from "fastify-jwt";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import { registerUserRoutes } from "./user/user.route";
import { registerAuthRoutes } from "./auth/auth.route";
import { version } from "../package.json";

export const app = Fastify({
    logger: true,
});
const port = Number(process.env.PORT) || 3000;

app.get("/ping", async () => ({ message: "pong!" }));

declare module "fastify-jwt" {
  interface FastifyJWT {
    payload: { userId: string };
    user: { userId: string };
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
    schemes: ["http"],
    consumes: ["application/json"],
    produces: ["application/json"],
  },
});

app.register(swaggerUI, {
  routePrefix: "/docs",
  swagger: {
    info: {
      title: "API Nexus",
      version,
    },
  },
  uiConfig: {
    docExpansion: "full",
    deepLinking: false,
  },
});

async function main() {
    try {
        app.register(fjwt, {
            secret: process.env.JWT_SECRET || 'defaultsecret',
            sign: { expiresIn: "30d" },
        });

        app.register(registerUserRoutes, { prefix: "/api/users" });
        app.register(registerAuthRoutes, { prefix: "/api/auth" });

        await app.listen({ port, host: "0.0.0.0"});
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
}

main();
