import z from 'zod';
import Schemas from '../../utils/schema';

export const ChannelsSchema = {
  createChannel: {
    body: z.object({
      recipientId: z.string().cuid(),
    }),
  },
  createGroup: {
    body: z.object({
      recipients: z.array(z.string().cuid()).min(2),
    }),
  },
  getChannelById: {
    params: Schemas.cuidParam,
  },
  updateChannelById: {
    params: Schemas.cuidParam,
    body: z
      .object({
        name: z.string().min(1).max(30),
        icon: z.string().cuid(),
      })
      .partial(),
  },
  deleteChannelById: {
    params: Schemas.cuidParam,
  },

  createChannelMembers: {
    params: Schemas.cuidParam,
    body: z.object({
      memberIds: z.array(z.string().cuid()).min(1),
    }),
  },
  deleteChannelMember: {
    params: z.object({
      id: z.string().cuid(),
      memberId: z.string().cuid(),
    }),
  },

  activateChannel: {
    params: Schemas.cuidParam,
  },
  deactivateChannel: {
    params: Schemas.cuidParam,
  },
};
