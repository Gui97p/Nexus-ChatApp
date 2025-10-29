import { FastifyInstance } from 'fastify';
import {
  createMessageHandler,
  deleteMessageHandler,
  getMessageHandler,
  getMessagesByAuthorHandler,
  getMessagesHandler,
  updateMessageHandler,
} from './message.controller';
import authenticate from '../../utils/auth';
import { zodValidate } from '../../utils/zodValidate';
import { MessageSchemas } from './message.schema';
import {
  CreateMessageRequest,
  DeleteMessageRequest,
  getAllMessages,
  getMessageByAuthorRequest,
  getMessageByIdRequest,
  UpdateMessageRequest,
} from './message.types';

export function registerMessageRoutes(app: FastifyInstance) {
  app.get<getAllMessages>(
    '/',
    { preHandler: [authenticate, zodValidate(MessageSchemas.getAll)] },
    getMessagesHandler,
  );
  app.get<getMessageByAuthorRequest>(
    '/author/:id',
    { preHandler: [authenticate, zodValidate(MessageSchemas.getByAuthor)] },
    getMessagesByAuthorHandler,
  );
  app.get<getMessageByIdRequest>(
    '/:id',
    { preHandler: [authenticate, zodValidate(MessageSchemas.getById)] },
    getMessageHandler,
  );
  app.post<CreateMessageRequest>(
    '/',
    { preHandler: [authenticate, zodValidate(MessageSchemas.create)] },
    createMessageHandler,
  );
  app.patch<UpdateMessageRequest>(
    '/:id',
    { preHandler: [authenticate, zodValidate(MessageSchemas.update)] },
    updateMessageHandler,
  );
  app.delete<DeleteMessageRequest>(
    '/:id',
    { preHandler: [authenticate, zodValidate(MessageSchemas.delete)] },
    deleteMessageHandler,
  );
}
