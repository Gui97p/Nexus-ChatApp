import { FastifyInstance } from "fastify";
import { authHandler } from "./auth.controller";
import zodValidate from "../../utils/zodValidate";
import { authSchema } from "./auth.schema";

export async function registerAuthRoutes(app: FastifyInstance) {
    app.post("/", { preHandler: zodValidate(authSchema) }, authHandler)
}
