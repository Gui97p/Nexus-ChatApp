import { FastifyReply, FastifyRequest } from "fastify";
import { createUser, deleteUser, findUserByEmail, findUserById, findUserByName, findUsers, updateUser } from "./user.service";
import { CreateUserInput, UpdateUserInput } from "./user.schema";

export async function getUsersHandler() {
    return await findUsers();
}

export async function getMeHandler(req: FastifyRequest, res: FastifyReply) {
    const userId = req.user.userId;

    const user = await findUserById( userId );

    if (!user) {
        return res.status(404).send({ message: "User not found" });
    }

    const { password, ...userWithoutPassword } = user;
    
    return res.send(userWithoutPassword);
}

export async function getUserHandler(req: FastifyRequest, res: FastifyReply) {
    const { id } = req.params as { id: string };

    const user = await findUserById( id )

    if (!user) {
        return res.status(404).send({ message: "User not found" });
    }

    const { password, ...userWithoutPassword } = user;
    
    return res.send(userWithoutPassword);
}

export async function createUserHandler(req: FastifyRequest, res: FastifyReply) {
    const body = req.body as CreateUserInput;

    let existingUser = await findUserByEmail(body.email);
    if (existingUser) {
        return res.status(409).send({ message: "Email already in use" });
    }
    existingUser = await findUserByName(body.name);
    if (existingUser) {
        return res.status(409).send({ message: "Username already in use" });
    }

    const user = await createUser(body);

    const { password, ...userWithoutPassword } = user;

    return res.status(201).send(userWithoutPassword);
}

export async function updateUserHandler(req: FastifyRequest, res: FastifyReply) {
    const { id } = req.params as { id: string };
    const body = req.body as UpdateUserInput;
    const userId = req.user.userId;

    if (userId !== id) {
        return res.status(403).send({ message: "You can only update your own account" });
    }

    try {
        const updatedUser = await updateUser(id, body);
        const { password, ...userWithoutPassword } = updatedUser;
        return res.send(userWithoutPassword);
    } catch (error) {
        return res.status(404).send({ message: "User not found" });
    }
}

export async function deleteUserHandler(req: FastifyRequest, res: FastifyReply) {
    const { id } = req.params as { id: string };
    const userId = req.user.userId;

    if (userId !== id) {
        return res.status(403).send({ message: "You can only delete your own account" });
    }

    try {
        await deleteUser(id);
        return res.status(200).send({ message: "User deleted successfully" });
    } catch (error) {
        return res.status(404).send({ message: "User not found" });
    }
}
