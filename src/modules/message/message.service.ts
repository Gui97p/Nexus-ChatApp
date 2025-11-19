import prisma from '../../utils/prisma';
import { createMessageType } from './message.types';

const author = {
  select: {
    name: true,
    displayName: true,
    avatar: true,
  },
};

const channel = {
  select: {
    name: true,
    type: true,
  },
};

const repliedTo = {
  select: {
    id: true,
    authorId: true,
  },
};

const attachments = {
  omit: {
    id: true,
    messageId: true,
    createdAt: true,
  },
};

interface GetMessagesParams {
  channelId: string;
  userId: string;
  limit?: number;
  before?: { type: 'id' | 'date'; value: string | Date };
  after?: { type: 'id' | 'date'; value: string | Date };
  order?: 'asc' | 'desc';
}

export function getMessages({
  channelId,
  userId,
  limit = 50,
  before,
  after,
  order = 'desc',
}: GetMessagesParams) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {
    channelId,
    OR: [
      { private: false },
      {
        AND: [
          { private: true },
          {
            OR: [
              { authorId: userId },
              {
                replies: {
                  some: { authorId: userId },
                },
              },
              {
                repliedTo: {
                  some: { authorId: userId },
                },
              },
            ],
          },
        ],
      },
    ],
  };

  where.id = {
    lt: before?.type == 'id' ? before.value : undefined,
    gt: after?.type == 'id' ? after.value : undefined,
  };

  where.createdAt = {
    lt: before?.type == 'date' ? before.value : undefined,
    gt: after?.type == 'date' ? after.value : undefined,
  };

  return prisma.message.findMany({
    take: limit,
    orderBy: [{ createdAt: order }, { id: order }],
    where,
    include: {
      author,
      channel,
      repliedTo,
      attachments,
    },
  });
}

export function getMessagesByIds(idArray: string[]) {
  return prisma.message.findMany({
    where: {
      id: {
        in: idArray,
      },
    },
  });
}

export function getMessageById(id: string) {
  return prisma.message.findUnique({
    where: { id },
    include: {
      author,
      channel,
      repliedTo,
      attachments,
    },
  });
}

export function getSensitiveById(id: string) {
  return prisma.message.findUnique({
    where: { id },
    include: {
      author,
      channel,
      repliedTo,
      attachments,
      replies: true,
    },
  });
}

export function createMessage(data: createMessageType) {
  return prisma.message.create({
    data: {
      content: data.content,
      authorId: data.authorId,
      channelId: data.channelId,
      private: data.private,
      silent: data.silent,

      attachments: {
        connect: data.attachments?.map((id) => ({ id })),
      },
      repliedTo: {
        connect: data.replies?.map((id) => ({ id })),
      },
    },
    include: {
      author,
      channel,
      repliedTo,
      attachments,
    },
  });
}

export function updateMessage(id: string, content: string) {
  return prisma.message.update({
    where: { id },
    data: { content },
    include: {
      author,
      channel,
      repliedTo,
      attachments,
    },
  });
}

export function deleteMessage(id: string) {
  return prisma.message.delete({
    where: { id },
  });
}
