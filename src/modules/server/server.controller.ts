import { FastifyReply, FastifyRequest } from 'fastify';
import {
  createServer,
  findServerById,
  findServerChannels,
  findServers,
  updateServer,
} from './server.service';
import { findFileById } from '../file/file.service';
import {
  CreateServerChannelRequest,
  CreateServerRequest,
  DeleteServerRequest,
  GetServerByIdRequest,
  UpdateServerRequest,
} from './server.types';
import { createServerChannel } from '../channel/channel.service';
import { ChannelType } from '@prisma/client';
import {
  CreateServerMemberRequest,
  DeleteServerMemberRequest,
  GetServerMemberByMemberIdRequest,
  UpdateServerMemberRequest,
} from '../serverMember/serverMember.types';
import {
  CreateServerMember,
  deleteServerMember,
  findServerMemberByMemberId,
  findServerMembersByServerId,
  updateServerMember,
} from '../serverMember/serverMember.service';

export async function getServersHandler(req: FastifyRequest, res: FastifyReply) {
  const servers = await findServers();

  for (const server of servers) {
    if (!server.icon) continue;
    server.icon = (await findFileById(server.icon))?.url || null;
  }

  return res.send({ data: servers });
}

export async function getServerHandler(
  req: FastifyRequest<GetServerByIdRequest>,
  res: FastifyReply,
) {
  const { id } = req.params;

  const server = await findServerById(id);

  if (!server) {
    return res.status(404).send({ message: 'Server not found' });
  }

  if (server.icon) {
    server.icon = (await findFileById(server.icon))?.url || null;
  }

  return res.send({ data: server });
}

export async function createServerHandler(
  req: FastifyRequest<CreateServerRequest>,
  res: FastifyReply,
) {
  const ownerId = req.user.userId;
  const body = req.body;

  const server = await createServer({
    ownerId,
    ...body,
  });

  return res.status(201).send({ data: server });
}

export async function updateServerHandler(
  req: FastifyRequest<UpdateServerRequest>,
  res: FastifyReply,
) {
  const { id } = req.params;
  const body = req.body;

  const server = await findServerById(id);
  if (!server) {
    return res.status(404).send({ message: 'Server not found' });
  }

  const updatedServer = await updateServer(id, body);

  return res.send({ data: updatedServer });
}

export async function deleteServerHandler(
  req: FastifyRequest<DeleteServerRequest>,
  res: FastifyReply,
) {
  const { id } = req.params;

  const server = await findServerById(id);
  if (!server) {
    return res.status(404).send({ message: 'Server not found' });
  }

  return res.send({ data: 'Server deleted successfully' });
}

export async function getServerChannelsHandler(
  req: FastifyRequest<GetServerByIdRequest>,
  res: FastifyReply,
) {
  const { id } = req.params;

  const channels = (await findServerChannels(id))?.channels;

  if (!channels) {
    return res.status(404).send({ message: 'Server not found' });
  }

  return res.send({ data: channels });
}

export async function createServerChannelHandler(
  req: FastifyRequest<CreateServerChannelRequest>,
  res: FastifyReply,
) {
  const { id: serverId } = req.params;
  const { name, type, parentId } = req.body;

  const server = await findServerById(serverId);
  if (!server) {
    return res.status(404).send({ message: 'Server not found' });
  }

  const channel = await createServerChannel({
    name,
    type: type.toUpperCase() as Exclude<ChannelType, 'DM' | 'GROUP_DM'>,
    serverId,
    parentId,
  });

  return res.status(201).send({ data: channel });
}

export async function getServerMembersHandler(
  req: FastifyRequest<GetServerByIdRequest>,
  res: FastifyReply,
) {
  const { id } = req.params;

  const server = await findServerById(id);
  if (!server) {
    return res.status(404).send({ message: 'Server not found' });
  }

  const members = await findServerMembersByServerId(id);

  return res.send({ data: members });
}

export async function getServerMemberByIdHandler(
  req: FastifyRequest<GetServerMemberByMemberIdRequest>,
  res: FastifyReply,
) {
  const { id: serverId, memberId } = req.params;

  const server = await findServerById(serverId);
  if (!server) {
    return res.status(404).send({ message: 'Server not found' });
  }

  const member = await findServerMemberByMemberId(serverId, memberId);
  if (!member) {
    return res.status(404).send({ message: 'Member not found in server' });
  }

  return res.send({ data: member });
}

export async function createServerMemberHandler(
  req: FastifyRequest<CreateServerMemberRequest>,
  res: FastifyReply,
) {
  const { id: serverId } = req.params;
  const { memberId } = req.body;

  const server = await findServerById(serverId);
  if (!server) {
    return res.status(404).send({ message: 'Server not found' });
  }

  const member = await CreateServerMember(serverId, memberId);

  return res.status(201).send({ data: member });
}

export async function updateServerMemberHandler(
  req: FastifyRequest<UpdateServerMemberRequest>,
  res: FastifyReply,
) {
  const { id: serverId, memberId } = req.params;
  const body = req.body;

  const server = await findServerById(serverId);
  if (!server) {
    return res.status(404).send({ message: 'Server not found' });
  }

  const member = await findServerMemberByMemberId(serverId, memberId);
  if (!member) {
    return res.status(404).send({ message: 'Member not found in server' });
  }

  const updatedServerMember = await updateServerMember(serverId, memberId, body);

  return res.send({ data: updatedServerMember });
}

export async function deleteServerMemberHandler(
  req: FastifyRequest<DeleteServerMemberRequest>,
  res: FastifyReply,
) {
  const { id: serverId, memberId } = req.params;

  const server = await findServerById(serverId);
  if (!server) {
    return res.status(404).send({ message: 'Server not found' });
  }

  const member = await findServerMemberByMemberId(serverId, memberId);
  if (!member) {
    return res.status(404).send({ message: 'Member not found in server' });
  }

  await deleteServerMember(serverId, memberId);

  return res.send({ data: 'Server member deleted successfully' });
}
