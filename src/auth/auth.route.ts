import { FastifyInstance } from "fastify";
import { authHandler } from "./auth.controller";
import { zodVerify } from "../utils/zodVerify";
import { authSchema } from "./auth.schema";

export async function registerAuthRoutes(app: FastifyInstance) {
    app.post("/", zodVerify(authSchema), authHandler)
}
