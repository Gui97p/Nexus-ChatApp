import { FastifyInstance } from 'fastify';
import {
  createServerChannelHandler,
  createServerHandler,
  deleteServerHandler,
  getServerChannelsHandler,
  getServerHandler,
  getServersHandler,
  updateServerHandler,
} from './server.controller';
import authenticate from '../../utils/auth';
import { zodValidate } from '../../utils/zodValidate';
import { serverSchemas } from './server.schema';
import {
  CreateServerChannelRequest,
  CreateServerRequest,
  DeleteServerRequest,
  GetServerByIdRequest,
  UpdateServerRequest,
} from './server.types';

export function registerServerRoutes(app: FastifyInstance) {
  app.get('/', { preHandler: authenticate }, getServersHandler);
  app.get<GetServerByIdRequest>(
    '/:id',
    { preHandler: [authenticate, zodValidate(serverSchemas.getById)] },
    getServerHandler,
  );
  app.get<GetServerByIdRequest>(
    '/:id/channels',
    { preHandler: [authenticate, zodValidate(serverSchemas.getById)] },
    getServerChannelsHandler,
  );
  app.post<CreateServerRequest>(
    '/',
    { preHandler: [authenticate, zodValidate(serverSchemas.create)] },
    createServerHandler,
  );
  app.post<CreateServerChannelRequest>(
    '/:id/channels',
    { preHandler: [authenticate, zodValidate(serverSchemas.createChannel)] },
    createServerChannelHandler,
  );
  app.patch<UpdateServerRequest>(
    '/:id',
    { preHandler: [authenticate, zodValidate(serverSchemas.update)] },
    updateServerHandler,
  );
  app.delete<DeleteServerRequest>(
    '/:id',
    { preHandler: [authenticate, zodValidate(serverSchemas.delete)] },
    deleteServerHandler,
  );
}
