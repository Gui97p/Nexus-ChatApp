import { FastifyInstance } from 'fastify';
import {
  createServerChannelHandler,
  createServerHandler,
  createServerMemberHandler,
  deleteServerHandler,
  deleteServerMemberHandler,
  getServerChannelsHandler,
  getServerHandler,
  getServerMemberByIdHandler,
  getServerMembersHandler,
  getServersHandler,
  updateServerHandler,
  updateServerMemberHandler,
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
import { serverMemberSchemas } from '../serverMember/serverMember.schema';
import {
  CreateServerMemberRequest,
  DeleteServerMemberRequest,
  GetServerMemberByMemberIdRequest,
  GetServerMembersByServerIdRequest,
  UpdateServerMemberRequest,
} from '../serverMember/serverMember.types';

export function registerServerRoutes(app: FastifyInstance) {
  app.get('/', { preHandler: authenticate }, getServersHandler);
  app.get<GetServerByIdRequest>(
    '/:id',
    { preHandler: [authenticate, zodValidate(serverSchemas.getById)] },
    getServerHandler,
  );
  app.post<CreateServerRequest>(
    '/',
    { preHandler: [authenticate, zodValidate(serverSchemas.create)] },
    createServerHandler,
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

  app.get<GetServerByIdRequest>(
    '/:id/channels',
    { preHandler: [authenticate, zodValidate(serverSchemas.getById)] },
    getServerChannelsHandler,
  );
  app.post<CreateServerChannelRequest>(
    '/:id/channels',
    { preHandler: [authenticate, zodValidate(serverSchemas.createChannel)] },
    createServerChannelHandler,
  );

  app.get<GetServerMembersByServerIdRequest>(
    '/:id/members',
    { preHandler: [authenticate, zodValidate(serverMemberSchemas.getByServerId)] },
    getServerMembersHandler,
  );
  app.get<GetServerMemberByMemberIdRequest>(
    '/:id/members/:memberId',
    { preHandler: [authenticate, zodValidate(serverMemberSchemas.getByMemberId)] },
    getServerMemberByIdHandler,
  );
  app.post<CreateServerMemberRequest>(
    '/:id/members',
    { preHandler: [authenticate, zodValidate(serverMemberSchemas.create)] },
    createServerMemberHandler,
  );
  app.patch<UpdateServerMemberRequest>(
    '/:id/members/:memberId',
    { preHandler: [authenticate, zodValidate(serverMemberSchemas.update)] },
    updateServerMemberHandler,
  );
  app.delete<DeleteServerMemberRequest>(
    '/:id/members/:memberId',
    { preHandler: [authenticate, zodValidate(serverMemberSchemas.delete)] },
    deleteServerMemberHandler,
  );
}
