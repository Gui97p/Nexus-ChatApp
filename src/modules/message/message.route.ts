import { FastifyInstance } from "fastify";
import { createMessageHandler, deleteMessageHandler, getMessageHandler, getMessagesByAuthorHandler, getMessagesHandler, updateMessageHandler } from "./message.controller";
import authenticate from "../../utils/auth";
import zodValidate from "../../utils/zodValidate";
import { CreateMessageSchema, UpdateMessageSchema } from "./message.schema";

export function registerMessageRoutes(app: FastifyInstance) {
    app.get('/', { preHandler: authenticate }, getMessagesHandler);
    app.get('/author/:userId', { preHandler: authenticate }, getMessagesByAuthorHandler);
    app.get('/:id', { preHandler: authenticate } , getMessageHandler);
    app.post('/', { preHandler: [ authenticate, zodValidate(CreateMessageSchema) ] } , createMessageHandler);
    app.patch('/:id', { preHandler: [ authenticate, zodValidate(UpdateMessageSchema) ] }, updateMessageHandler);
    app.delete('/:id', { preHandler: authenticate }, deleteMessageHandler);
}
