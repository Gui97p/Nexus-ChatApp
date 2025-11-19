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
        icon: z.string().cuid().nullable(),
        parentId: z.string().cuid().nullable(),
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

  getMessagesByChannel: {
    params: Schemas.cuidParam,
    query: z.object({
      limit: z.coerce.number().int().optional(),

      before: Schemas.idOrDate.optional(),
      after: Schemas.idOrDate.optional(),

      order: z.enum(['asc', 'desc']).optional(),
    }),
  },

  createMessage: {
    params: Schemas.cuidParam,
    body: z
      .object({
        content: z
          .string()
          .min(1, 'Content cannot be empty')
          .max(2000, 'Content cannot exceed 2000 characters'),
        replies: z.array(z.string().cuid()).max(5).optional(),
        attachments: z.array(z.string().cuid()).max(10).optional(),
        silent: z.boolean().optional(),
        private: z.boolean().optional(),
      })
      .superRefine((data, ctx) => {
        if (!data.replies || data.replies.length === 0) {
          if (data.private === true)
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "A message can't be private when there's no replies",
              path: ['private'],
            });
          if (data.silent === true)
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "A message can't be silent when there's no replies",
              path: ['silent'],
            });
        }
      }),
  },
};
