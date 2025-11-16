import prisma from '../../utils/prisma';
import { createServerChannel } from '../channel/channel.service';
import { CreateServerMember } from '../serverMember/serverMember.service';
import { CreateServerRequest, UpdateServerRequest } from './server.types';

export function findServers() {
  return prisma.server.findMany();
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
    data,
  });

  const category = await createServerChannel({
    name: 'GENERAL',
    type: 'CATEGORY',
    serverId: server.id,
  });
  await createServerChannel({
    name: 'general',
    type: 'TEXT',
    serverId: server.id,
    parentId: category.id,
  });

  await CreateServerMember(server.id, server.ownerId);

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
