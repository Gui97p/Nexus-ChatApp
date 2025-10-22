import { FastifyReply, FastifyRequest } from "fastify";
import { createUser, findUsers } from "./user.service";
import { CreateUserInput } from "./user.schema";

export async function getUsersHandler() {
    return await findUsers();
}

export async function createUserHandler(req: FastifyRequest, res: FastifyReply) {
    const body = req.body as CreateUserInput;
    const user = await createUser(body);

    const { password, ...userWithoutPassword } = user;

    return res.status(201).send(userWithoutPassword);
}
