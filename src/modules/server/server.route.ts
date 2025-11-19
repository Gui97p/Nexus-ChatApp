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
import { serverDocs } from './server.docs';

export function registerServerRoutes(app: FastifyInstance) {
  app.get('/', { preHandler: authenticate, schema: serverDocs.getServers }, getServersHandler);
  app.get<GetServerByIdRequest>(
    '/:id',
    { preHandler: [authenticate, zodValidate(serverSchemas.getById)], schema: serverDocs.getById },
    getServerHandler,
  );
  app.get('/me', { preHandler: authenticate, schema: serverDocs.getMyServers }, getServersHandler);
  app.post<CreateServerRequest>(
    '/',
    { preHandler: [authenticate, zodValidate(serverSchemas.create)], schema: serverDocs.create },
    createServerHandler,
  );
  app.patch<UpdateServerRequest>(
    '/:id',
    { preHandler: [authenticate, zodValidate(serverSchemas.update)], schema: serverDocs.update },
    updateServerHandler,
  );
  app.delete<DeleteServerRequest>(
    '/:id',
    { preHandler: [authenticate, zodValidate(serverSchemas.delete)], schema: serverDocs.delete },
    deleteServerHandler,
  );

  app.get<GetServerByIdRequest>(
    '/:id/channels',
    {
      preHandler: [authenticate, zodValidate(serverSchemas.getById)],
      schema: serverDocs.getServerChannels,
    },
    getServerChannelsHandler,
  );
  app.post<CreateServerChannelRequest>(
    '/:id/channels',
    {
      preHandler: [authenticate, zodValidate(serverSchemas.createChannel)],
      schema: serverDocs.createServerChannel,
    },
    createServerChannelHandler,
  );

  app.get<GetServerMembersByServerIdRequest>(
    '/:id/members',
    {
      preHandler: [authenticate, zodValidate(serverMemberSchemas.getByServerId)],
      schema: serverDocs.getServerMembers,
    },
    getServerMembersHandler,
  );
  app.get<GetServerMemberByMemberIdRequest>(
    '/:id/members/:memberId',
    {
      preHandler: [authenticate, zodValidate(serverMemberSchemas.getByMemberId)],
      schema: serverDocs.getServerMemberById,
    },
    getServerMemberByIdHandler,
  );
  app.post<CreateServerMemberRequest>(
    '/:id/members',
    {
      preHandler: [authenticate, zodValidate(serverMemberSchemas.create)],
      schema: serverDocs.createServerMember,
    },
    createServerMemberHandler,
  );
  app.patch<UpdateServerMemberRequest>(
    '/:id/members/:memberId',
    {
      preHandler: [authenticate, zodValidate(serverMemberSchemas.update)],
      schema: serverDocs.updateServerMember,
    },
    updateServerMemberHandler,
  );
  app.delete<DeleteServerMemberRequest>(
    '/:id/members/:memberId',
    {
      preHandler: [authenticate, zodValidate(serverMemberSchemas.delete)],
      schema: serverDocs.deleteServerMember,
    },
    deleteServerMemberHandler,
  );
}
