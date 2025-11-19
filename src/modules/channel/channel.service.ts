import prisma from '../../utils/prisma';
import { UpdateChannelByIdRequest } from './channel.types';

export function getActiveChannelsByUserId(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      activeChannels: {
        include: {
          recipients: true,
        },
      },
    },
  });
}

export function getDmChannelBetweenUsers(userId1: string, userId2: string) {
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
    include: {
      recipients: true,
    },
  });
}

export function getChannelById(id: string) {
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
  });
}
