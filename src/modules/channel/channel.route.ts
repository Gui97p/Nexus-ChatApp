import { FastifyInstance } from 'fastify';
import authenticate from '../../utils/auth';
import { zodValidate } from '../../utils/zodValidate';
import { ChannelsSchema } from './channels.schema';
import {
  activateChannelHandler,
  createChannelHandler,
  createChannelMembersHandler,
  createGroupHandler,
  deactivateChannelHandler,
  deleteChannelByIdHandler,
  deleteChannelMemberHandler,
  getChannelByIdHandler,
  getActiveChannelsHandler,
  updateChannelByIdHandler,
  getDmByIdHandler,
} from './channel.controller';
import {
  ActivateChannelRequest,
  CreateChannelMembersRequest,
  CreateChannelRequest,
  CreateGroupRequest,
  DeactivateChannelRequest,
  DeleteChannelByIdRequest,
  DeleteChannelMemberRequest,
  GetChannelByIdRequest,
  UpdateChannelByIdRequest,
} from './channel.types';

export function registerChannelRoutes(app: FastifyInstance) {
  app.post<CreateChannelRequest>(
    '/',
    { preHandler: [authenticate, zodValidate(ChannelsSchema.createChannel)] },
    createChannelHandler,
  );
  app.post<CreateGroupRequest>(
    '/group',
    { preHandler: [authenticate, zodValidate(ChannelsSchema.createGroup)] },
    createGroupHandler,
  );
  app.get<GetChannelByIdRequest>(
    '/:id',
    { preHandler: [authenticate, zodValidate(ChannelsSchema.getChannelById)] },
    getChannelByIdHandler,
  );
  app.get<GetChannelByIdRequest>(
    '/dm/:id',
    { preHandler: [authenticate, zodValidate(ChannelsSchema.getChannelById)] },
    getDmByIdHandler,
  );
  app.patch<UpdateChannelByIdRequest>(
    '/:id',
    { preHandler: [authenticate, zodValidate(ChannelsSchema.updateChannelById)] },
    updateChannelByIdHandler,
  );
  app.delete<DeleteChannelByIdRequest>(
    '/:id',
    { preHandler: [authenticate, zodValidate(ChannelsSchema.deleteChannelById)] },
    deleteChannelByIdHandler,
  );

  app.post<CreateChannelMembersRequest>(
    '/:id/member',
    { preHandler: [authenticate, zodValidate(ChannelsSchema.createChannelMembers)] },
    createChannelMembersHandler,
  );
  app.delete<DeleteChannelMemberRequest>(
    '/:id/member/:memberId',
    { preHandler: [authenticate, zodValidate(ChannelsSchema.deleteChannelMember)] },
    deleteChannelMemberHandler,
  );

  app.get('/active', { preHandler: authenticate }, getActiveChannelsHandler);
  app.post<ActivateChannelRequest>(
    '/active/:id',
    { preHandler: [authenticate, zodValidate(ChannelsSchema.activateChannel)] },
    activateChannelHandler,
  );
  app.delete<DeactivateChannelRequest>(
    '/active/:id',
    { preHandler: [authenticate, zodValidate(ChannelsSchema.deactivateChannel)] },
    deactivateChannelHandler,
  );
}
