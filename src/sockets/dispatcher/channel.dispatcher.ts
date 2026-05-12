import { Channel } from '@prisma/client';
import { getSocketServer } from '../../utils/socket';

function dispatchServer(event: string, serverId: string, payload: unknown) {
  const server = getSocketServer();
  if (!server) return;

  const room = `server:${serverId}`;
  server.to(room).emit(event, payload);
}

export function dispatchServerChannelCreate(channel: Omit<Channel, 'ownerId' | 'icon'>) {
  return dispatchServer('channel:new', channel.serverId!, channel);
}

export function dispatchServerChannelUpdate(channel: Omit<Channel, 'ownerId' | 'icon'>) {
  return dispatchServer('channel:update', channel.serverId!, channel);
}

export function dispatchServerChannelDelete(serverId: string, channelId: string) {
  return dispatchServer('channel:delete', serverId, { channelId });
}

function dispatchDm(event: string, userIds: string[], payload: unknown) {
  const server = getSocketServer();
  if (!server) return;

  userIds.forEach((id) => {
    const room = `user:${id}`;
    server.to(room).emit(event, payload);
  });
}

export function dispatchChannelCreate(recipients: string[], channelId: string) {
  return dispatchDm('group:new', recipients, { channelId });
}

export function dispatchChannelUpdate(recipients: string[], channel: Channel) {
  return dispatchDm('group:update', recipients, channel);
}

export function dispatchChannelDelete(recipients: string[], channelId: string) {
  return dispatchDm('group:delete', recipients, { channelId });
}
