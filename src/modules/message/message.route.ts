import { FastifyInstance } from 'fastify';
import {
  createMessageHandler,
  deleteMessageHandler,
  getMessageHandler,
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
  getMessageByIdRequest,
  UpdateMessageRequest,
} from './message.types';
import { MessageDocs } from './message.docs';

export function registerMessageRoutes(app: FastifyInstance) {
  app.get<getAllMessages>(
    '/',
    { preHandler: [authenticate, zodValidate(MessageSchemas.getAll)], schema: MessageDocs.getAll },
    getMessagesHandler,
  );
  app.get<getMessageByIdRequest>(
    '/:id',
    {
      preHandler: [authenticate, zodValidate(MessageSchemas.getById)],
      schema: MessageDocs.getById,
    },
    getMessageHandler,
  );
  app.post<CreateMessageRequest>(
    '/',
    { preHandler: [authenticate, zodValidate(MessageSchemas.create)], schema: MessageDocs.create },
    createMessageHandler,
  );
  app.patch<UpdateMessageRequest>(
    '/:id',
    { preHandler: [authenticate, zodValidate(MessageSchemas.update)], schema: MessageDocs.update },
    updateMessageHandler,
  );
  app.delete<DeleteMessageRequest>(
    '/:id',
    { preHandler: [authenticate, zodValidate(MessageSchemas.delete)], schema: MessageDocs.delete },
    deleteMessageHandler,
  );
}
