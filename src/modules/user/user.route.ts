import { FastifyInstance } from "fastify";
import { createUserHandler, deleteUserHandler, getMeHandler, getUserHandler, getUsersHandler, updateUserHandler } from "./user.controller";
import zodValidate from "../../utils/zodValidate";
import { createUserSchema } from "./user.schema";
import authenticate from "../../utils/auth";

export async function registerUserRoutes(app: FastifyInstance) {
    app.get("/", { preHandler: authenticate }, getUsersHandler);
    app.get('/:id', { preHandler: authenticate }, getUserHandler);
    app.get('/me', { preHandler: authenticate }, getMeHandler);
    app.post("/", { preHandler: zodValidate(createUserSchema) }, createUserHandler);
    app.patch('/:id', { preHandler: authenticate }, updateUserHandler);
    app.delete('/:id', { preHandler: authenticate }, deleteUserHandler);
}
