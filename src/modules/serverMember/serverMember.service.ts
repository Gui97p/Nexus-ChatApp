import prisma from '../../utils/prisma';
import { UpdateServerMemberRequest } from './serverMember.types';

export function findServerMembersByServerId(serverId: string) {
  return prisma.serverMember.findMany({
    where: { serverId },
  });
}

export function findServerMemberByMemberId(serverId: string, memberId: string) {
  return prisma.serverMember.findFirst({
    where: { serverId, memberId },
  });
}

export function CreateServerMember(serverId: string, memberId: string) {
  return prisma.serverMember.create({
    data: {
      serverId,
      memberId,
    },
  });
}

export function updateServerMember(
  serverId: string,
  memberId: string,
  data: UpdateServerMemberRequest['Body'],
) {
  return prisma.serverMember.updateMany({
    where: { serverId, memberId },
    data,
  });
}

export function deleteServerMember(serverId: string, memberId: string) {
  return prisma.serverMember.deleteMany({
    where: { serverId, memberId },
  });
}
