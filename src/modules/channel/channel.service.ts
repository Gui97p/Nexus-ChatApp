import prisma from '../../utils/prisma';
import { UpdateChannelByIdRequest } from './channel.types';

export function findActiveChannelsByUserId(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      activeChannels: {
        omit: {
          serverId: true,
          parentId: true,
        },
        include: {
          recipients: true,
        },
      },
    },
  });
}

export function findDmChannelBetweenUsers(userId1: string, userId2: string) {
  return prisma.channel.findFirst({
    where: {
      type: 'DM',
      recipients: {
        every: {
          userId: {
            in: [userId1, userId2],
          },
        },
      },
    },
    omit: {
      serverId: true,
      parentId: true,
      icon: true,
      name: true,
      ownerId: true,
    },
    include: {
      recipients: true,
    },
  });
}

export function findChannelById(id: string) {
  return prisma.channel.findUnique({
    where: { id },
    omit: {
      serverId: true,
      parentId: true,
    },
    include: {
      recipients: true,
    },
  });
}

export function findSensitiveChannelById(id: string) {
  return prisma.channel.findUnique({
    where: { id },
    include: {
      recipients: true,
    },
  });
}

export function createChannel(data: { type: 'DM' | 'GROUP_DM'; recipientIds: string[] }) {
  return prisma.channel.create({
    data: {
      type: data.type,
      recipients: {
        createMany: {
          data: data.recipientIds.map((userId) => ({
            userId,
          })),
        },
      },
    },
    omit: {
      serverId: true,
      parentId: true,
    },
    include: {
      recipients: true,
    },
  });
}

export function createServerChannel({
  name,
  type,
  serverId,
  parentId,
}: {
  name: string;
  type: 'CATEGORY' | 'TEXT';
  serverId: string;
  parentId?: string;
}) {
  return prisma.channel.create({
    data: {
      name,
      type,
      serverId,
      parentId,
    },
    omit: {
      icon: true,
      ownerId: true,
    },
  });
}

export function updateChannelById(id: string, data: UpdateChannelByIdRequest['Body']) {
  return prisma.channel.update({
    where: { id },
    data,
    include: {
      recipients: true,
    },
  });
}

export function deleteChannelById(id: string) {
  return prisma.channel.delete({
    where: { id },
  });
}

export function addActiveChannel(userId: string, channelId: string) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      activeChannels: {
        connect: { id: channelId },
      },
    },
    select: {
      activeChannels: true,
    },
  });
}

export function removeActiveChannel(userId: string, channelId: string) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      activeChannels: {
        disconnect: { id: channelId },
      },
    },
    select: {
      activeChannels: true,
    },
  });
}
