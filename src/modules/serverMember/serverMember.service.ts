import prisma from '../../utils/prisma';

export function CreateServerMember(serverId: string, memberId: string) {
  return prisma.serverMember.create({
    data: {
      serverId,
      memberId,
    },
  });
}
