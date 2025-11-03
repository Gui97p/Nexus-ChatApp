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
    {
      preHandler: [authenticate, zodValidate(MessageSchemas.getAll)],
      schema: MessageDocs.getAll,
      config: {
        rateLimit: {
          max: 120,
          timeWindow: '1 minute',
        },
      },
    },
    getMessagesHandler,
  );
  app.get<getMessageByIdRequest>(
    '/:id',
    {
      preHandler: [authenticate, zodValidate(MessageSchemas.getById)],
      schema: MessageDocs.getById,
      config: {
        rateLimit: {
          max: 120,
          timeWindow: '1 minute',
        },
      },
    },
    getMessageHandler,
  );
  app.post<CreateMessageRequest>(
    '/',
    {
      preHandler: [authenticate, zodValidate(MessageSchemas.create)],
      schema: MessageDocs.create,
      config: {
        rateLimit: {
          max: 30,
          timeWindow: '30 seconds',
        },
      },
    },
    createMessageHandler,
  );
  app.patch<UpdateMessageRequest>(
    '/:id',
    {
      preHandler: [authenticate, zodValidate(MessageSchemas.update)],
      schema: MessageDocs.update,
      config: {
        rateLimit: {
          max: 30,
          timeWindow: '30 seconds',
        },
      },
    },
    updateMessageHandler,
  );
  app.delete<DeleteMessageRequest>(
    '/:id',
    {
      preHandler: [authenticate, zodValidate(MessageSchemas.delete)],
      schema: MessageDocs.delete,
      config: {
        rateLimit: {
          max: 60,
          timeWindow: '1 minute',
        },
      },
    },
    deleteMessageHandler,
  );
}
