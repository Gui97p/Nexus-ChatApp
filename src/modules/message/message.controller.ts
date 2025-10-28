import { FastifyReply, FastifyRequest } from "fastify";
import { createMessage, deleteMessage, getMessageById, getMessages, getMessagesByAuthor, updateMessage } from "./message.service";
import { CreateMessageInput, UpdateMessageInput } from "./message.schema";
import { getSocketServer } from "../../utils/socket";
import { createMessageType } from "./message.types";

function parseToInt(value: string | undefined, defaultValue?: number): number | undefined {
    if (!value) return defaultValue;
    const parsed = parseInt(value);
    return isNaN(parsed) ? defaultValue : parsed;
}

export async function getMessagesHandler(req: FastifyRequest, res: FastifyReply) {
    const { limit, offset } = req.query as { limit?: string; offset?: string };
    const newlimit = parseToInt(limit);
    const newOffset = parseToInt(offset);
    console.log(newlimit, newOffset);

    const messages = await getMessages(newlimit, newOffset);

    return res.send({ message: messages });
}

export async function getMessagesByAuthorHandler(req: FastifyRequest, res: FastifyReply) {
    const { userId } = req.params as { userId: string };
    const { limit, offset } = req.query as { limit?: string; offset?: string };
    const newlimit = parseToInt(limit);
    const newOffset = parseToInt(offset);

    const messages = await getMessagesByAuthor(userId, newlimit, newOffset);

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

    const createData = { ...body } as createMessageType
    createData.replies = []
    body.replies?.forEach(id => createData.replies?.push({ id }))

    const newMessage = await createMessage(createData);

    const server = getSocketServer()
    server.to('channel:global').emit("message:new", newMessage);

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

    const server = getSocketServer()
    server.to('channel:global').emit("message:updated", updatedMessage);

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

    const server = getSocketServer()
    server.to('channel:global').emit("message:deleted", { id });

    return res.send({ message: "Message deleted successfully" });
}
