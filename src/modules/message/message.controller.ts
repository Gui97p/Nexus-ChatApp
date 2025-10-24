import { FastifyReply, FastifyRequest } from "fastify";
import { createMessage, deleteMessage, getMessageById, getMessages, getMessagesByAuthor, updateMessage } from "./message.service";
import { CreateMessageInput, UpdateMessageInput } from "./message.schema";
import { app } from "../..";
import { getSocketServer } from "../../utils/socket";

export async function getMessagesHandler(req: FastifyRequest, res: FastifyReply) {
    const { quantity, offset } = req.query as { quantity?: number; offset?: number };

    const messages = await getMessages(quantity, offset);

    return res.send({ message: messages });
}

export async function getMessagesByAuthorHandler(req: FastifyRequest, res: FastifyReply) {
    const { userId } = req.params as { userId: string };
    const { quantity, offset } = req.query as { quantity?: number; offset?: number };

    const messages = await getMessagesByAuthor(userId, quantity, offset);

    return res.send({ message: messages });
}

export async function getMessageHandler(req: FastifyRequest, res: FastifyReply) {
    const { id } = req.params as { id: string };
    
    const message = await getMessageById(id);

    return res.send({ message });
}

export async function createMessageHandler(req: FastifyRequest, res: FastifyReply) {
    const body = req.body as CreateMessageInput & { authorId: string };
    body.authorId = req.user.userId;

    const newMessage = await createMessage(body);

    getSocketServer().to('channel:global').emit("message:new", newMessage);

    return res.code(201).send({ message: newMessage });
}

export async function updateMessageHandler(req: FastifyRequest, res: FastifyReply) {
    const { id } = req.params as { id: string };
    const userId = req.user.userId;
    const { content } = req.body as UpdateMessageInput;

    const message = await getMessageById(id);

    if (!message) {
        return res.code(404).send({ message: "Message not found" });
    }

    if (userId !== message.authorId) {
        return res.code(403).send({ message: "You must be the author of the message to update it" });
    }

    const updatedMessage = await updateMessage(id, content);

    getSocketServer().to('channel:global').emit("message:updated", updatedMessage);

    return res.send({ message: updatedMessage });
}

export async function deleteMessageHandler(req: FastifyRequest, res: FastifyReply) {
    const { id } = req.params as { id: string };
    const userId = req.user.userId;

    const message = await getMessageById(id);

    if (!message) {
        return res.code(404).send({ message: "Message not found" });
    }

    if (userId !== message.authorId) {
        return res.code(403).send({ message: "You must be the author of the message to delete it" });
    }

    await deleteMessage(id);

    getSocketServer().to('channel:global').emit("message:deleted", { id });

    return res.send({ message: "Message deleted successfully" });
}
