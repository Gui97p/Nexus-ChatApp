import { FastifyInstance } from 'fastify';
import {
  deleteMessageHandler,
  getMessageHandler,
  updateMessageHandler,
} from './message.controller';
import authenticate from '../../utils/auth';
import { zodValidate } from '../../utils/zodValidate';
import { MessageSchemas } from './message.schema';
import { DeleteMessageRequest, getMessageByIdRequest, UpdateMessageRequest } from './message.types';
import { MessageDocs } from './message.docs';

export function registerMessageRoutes(app: FastifyInstance) {
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
