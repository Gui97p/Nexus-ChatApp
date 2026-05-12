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
  getMessagesHandler,
  createMessageHandler,
} from './channel.controller';
import {
  ActivateChannelRequest,
  CreateChannelMembersRequest,
  CreateChannelRequest,
  CreateGroupRequest,
  CreateMessageRequest,
  DeactivateChannelRequest,
  DeleteChannelByIdRequest,
  DeleteChannelMemberRequest,
  getAllMessages,
  GetChannelByIdRequest,
  UpdateChannelByIdRequest,
} from './channel.types';
import { channelDocs } from './channel.docs';

export function registerChannelRoutes(app: FastifyInstance) {
  app.post<CreateChannelRequest>(
    '/',
    {
      preHandler: [authenticate, zodValidate(ChannelsSchema.createChannel)],
      schema: channelDocs.createChannel,
    },
    createChannelHandler,
  );
  app.post<CreateGroupRequest>(
    '/group',
    {
      preHandler: [authenticate, zodValidate(ChannelsSchema.createGroup)],
      schema: channelDocs.createGroup,
    },
    createGroupHandler,
  );
  app.get<GetChannelByIdRequest>(
    '/:id',
    {
      preHandler: [authenticate, zodValidate(ChannelsSchema.getChannelById)],
      schema: channelDocs.getChannelById,
    },
    getChannelByIdHandler,
  );
  app.get<GetChannelByIdRequest>(
    '/dm/:id',
    {
      preHandler: [authenticate, zodValidate(ChannelsSchema.getChannelById)],
      schema: channelDocs.getDmById,
    },
    getDmByIdHandler,
  );
  app.patch<UpdateChannelByIdRequest>(
    '/:id',
    {
      preHandler: [authenticate, zodValidate(ChannelsSchema.updateChannelById)],
      schema: channelDocs.updateChannel,
    },
    updateChannelByIdHandler,
  );
  app.delete<DeleteChannelByIdRequest>(
    '/:id',
    {
      preHandler: [authenticate, zodValidate(ChannelsSchema.deleteChannelById)],
      schema: channelDocs.deleteChannel,
    },
    deleteChannelByIdHandler,
  );

  app.post<CreateChannelMembersRequest>(
    '/:id/members',
    {
      preHandler: [authenticate, zodValidate(ChannelsSchema.createChannelMembers)],
      schema: channelDocs.createChannelMembers,
    },
    createChannelMembersHandler,
  );
  app.delete<DeleteChannelMemberRequest>(
    '/:id/members/:memberId',
    {
      preHandler: [authenticate, zodValidate(ChannelsSchema.deleteChannelMember)],
      schema: channelDocs.deleteChannelMember,
    },
    deleteChannelMemberHandler,
  );

  app.get(
    '/active',
    { preHandler: authenticate, schema: channelDocs.getActiveChannels },
    getActiveChannelsHandler,
  );
  app.post<ActivateChannelRequest>(
    '/active/:id',
    {
      preHandler: [authenticate, zodValidate(ChannelsSchema.activateChannel)],
      schema: channelDocs.activateChannel,
    },
    activateChannelHandler,
  );
  app.delete<DeactivateChannelRequest>(
    '/active/:id',
    {
      preHandler: [authenticate, zodValidate(ChannelsSchema.deactivateChannel)],
      schema: channelDocs.deactivateChannel,
    },
    deactivateChannelHandler,
  );

  app.get<getAllMessages>(
    '/:id/messages',
    {
      preHandler: [authenticate, zodValidate(ChannelsSchema.getMessagesByChannel)],
      schema: channelDocs.getChannelMessages,
      config: {
        rateLimit: {
          max: 120,
          timeWindow: '1 minute',
        },
      },
    },
    getMessagesHandler,
  );

  app.post<CreateMessageRequest>(
    '/:id/messages',
    {
      preHandler: [authenticate, zodValidate(ChannelsSchema.createMessage)],
      schema: channelDocs.createMessage,
      config: {
        rateLimit: {
          max: 30,
          timeWindow: '30 seconds',
        },
      },
    },
    createMessageHandler,
  );
}
