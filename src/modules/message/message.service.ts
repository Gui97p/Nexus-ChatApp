import prisma from '../../utils/prisma';
import { createMessageType } from './message.types';

const author = {
  select: {
    name: true,
    displayName: true,
    avatar: true,
  },
};

const repliedTo = {
  select: {
    id: true,
    authorId: true,
  },
};

interface GetMessagesParams {
  userId: string;
  limit?: number;
  before?: { type: 'id' | 'date'; value: string | Date };
  after?: { type: 'id' | 'date'; value: string | Date };
  order?: 'asc' | 'desc';
}

export function getMessages({
  userId,
  limit = 50,
  before,
  after,
  order = 'desc',
}: GetMessagesParams) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {
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
      repliedTo,
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
      repliedTo,
    },
  });
}

export function getSensitiveById(id: string) {
  return prisma.message.findUnique({
    where: { id },
    include: {
      author,
      repliedTo,
      replies: true,
    },
  });
}

export function createMessage(data: createMessageType) {
  return prisma.message.create({
    data: {
      content: data.content,
      authorId: data.authorId,
      private: data.private,
      silent: data.silent,

      repliedTo: {
        connect: data.replies,
      },
    },
    include: {
      author,
      repliedTo,
    },
  });
}

export function updateMessage(id: string, content: string) {
  return prisma.message.update({
    where: { id },
    data: { content },
  });
}

export function deleteMessage(id: string) {
  return prisma.message.delete({
    where: { id },
  });
}
