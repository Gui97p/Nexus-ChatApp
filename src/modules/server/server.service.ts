import prisma from '../../utils/prisma';
import { CreateServerRequest, UpdateServerRequest } from './server.types';

export function findServers() {
  return prisma.server.findMany();
}

export function findServersJoinedByUser(userId: string) {
  return prisma.server.findMany({
    where: {
      members: {
        some: {
          memberId: userId,
        },
      },
    },
  });
}

export function findServerById(id: string) {
  return prisma.server.findUnique({
    where: { id },
  });
}

export function findServerChannels(id: string) {
  return prisma.server.findUnique({
    where: { id },
    select: {
      channels: true,
    },
  });
}

export async function createServer(data: CreateServerRequest['Body'] & { ownerId: string }) {
  const server = await prisma.server.create({
    data: {
      ...data,
      channels: {
        createMany: {
          data: [
            { name: 'GENERAL', type: 'CATEGORY' },
            { name: 'general', type: 'TEXT' },
          ],
        },
      },
      members: {
        create: {
          memberId: data.ownerId,
        },
      },
    },
  });

  return prisma.server.findUnique({
    where: { id: server.id },
    include: {
      members: true,
      channels: true,
    },
  });
}

export function updateServer(id: string, data: UpdateServerRequest['Body']) {
  return prisma.server.update({
    where: { id },
    data,
  });
}

export function deleteServer(id: string) {
  return prisma.server.delete({
    where: { id },
  });
}
