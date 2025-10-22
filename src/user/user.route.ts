import { FastifyInstance } from "fastify";
import { createUserHandler, getUsersHandler } from "./user.controller";
import { zodVerify } from "../utils/zodVerify";
import { createUserResponseSchema, createUserSchema } from "./user.schema";
import { authenticate } from "../utils/auth";

export async function registerUserRoutes(app: FastifyInstance) {
    app.get("/", { preHandler: authenticate }, getUsersHandler);
    app.post("/", zodVerify(createUserSchema), createUserHandler)
}
