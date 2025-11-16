import prisma from '../../utils/prisma';

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
