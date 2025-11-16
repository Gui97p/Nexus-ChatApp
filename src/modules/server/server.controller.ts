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

  await updateServer(id, body);

  return res.send({ data: 'Server updated successfully' });
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
