import { FastifyReply, FastifyRequest } from "fastify";
import { createUser, deleteUser, findUserById, findUsers, updateUser } from "./user.service";
import { CreateUserInput, UpdateUserInput } from "./user.schema";

export async function getUsersHandler() {
    return await findUsers();
}

export async function getUserHandler(req: FastifyRequest, res: FastifyReply) {
    const { id } = req.params as { id: string };
    console.log(req.user.userId)

    const user = await findUserById( id )

    if (!user) {
        return res.status(404).send({ message: "User not found" });
    }

    const { password, ...userWithoutPassword } = user;
    
    return res.send(userWithoutPassword);
}

export async function createUserHandler(req: FastifyRequest, res: FastifyReply) {
    const body = req.body as CreateUserInput;
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
