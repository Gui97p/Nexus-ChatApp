import prisma from '../../utils/prisma';

export function getChannelMember(channelId: string, memberId: string) {
  return prisma.channelMember.findFirst({
    where: {
      channelId,
      userId: memberId,
    },
  });
}

export function createChannelMemberBulk(channelId: string, memberIds: string[]) {
  return prisma.channelMember.createMany({
    data: memberIds.map((userId) => ({
      channelId: channelId,
      userId,
    })),
    skipDuplicates: true,
  });
}

export function deleteChannelMember(channelId: string, memberId: string) {
  return prisma.channelMember.deleteMany({
    where: {
      channelId,
      userId: memberId,
    },
  });
}
