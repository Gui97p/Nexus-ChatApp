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
  },
};

interface GetMessagesParams {
  limit?: number;
  before?: { type: 'id' | 'date'; value: string | Date };
  after?: { type: 'id' | 'date'; value: string | Date };
  order?: 'asc' | 'desc';
}

export function getMessages({ limit = 50, before, after, order = 'desc' }: GetMessagesParams) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};

  if (before) {
    if (before.type === 'id') {
      where.id = { lt: before.value };
    } else {
      where.createdAt = { lt: before.value };
    }
  }

  if (after) {
    if (after.type === 'id') {
      const existingId = where.id || {};
      where.id = { gt: after.value, ...existingId };
    } else {
      const existingCreatedAt = where.createdAt || {};
      where.createdAt = { gt: after.value, ...existingCreatedAt };
    }
  }

  return prisma.message.findMany({
    take: limit,
    orderBy: { createdAt: order, id: order },
    where,
    include: {
      author,
      repliedTo,
    },
  });
}

export function getMessagesByAuthor(
  userId: string,
  { limit = 50, before, after, order = 'desc' }: GetMessagesParams,
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};

  if (before) {
    if (before.type === 'id') {
      where.id = { lt: before.value };
    } else {
      where.createdAt = { lt: before.value };
    }
  }

  if (after) {
    if (after.type === 'id') {
      const existingId = where.id || {};
      where.id = { gt: after.value, ...existingId };
    } else {
      const existingCreatedAt = where.createdAt || {};
      where.createdAt = { gt: after.value, ...existingCreatedAt };
    }
  }

  return prisma.message.findMany({
    where: { authorId: userId, ...where },
    take: limit,
    orderBy: { createdAt: order, id: order },
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
