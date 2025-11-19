import { Message } from '@prisma/client';
import { getSocketServer } from '../../utils/socket';

function dispatch(event: string, channelId: string, payload: unknown) {
  const server = getSocketServer();
  if (!server) return;

  const room = `channel:${channelId}`;
  server.to(room).emit(event, payload);
}

export function dispatchMessage(message: Message) {
  return dispatch('message:new', message.channelId, message);
}

export function dispatchMessageUpdate(message: Message) {
  return dispatch('message:update', message.channelId, message);
}

export function dispatchMessageDelete(channelId: string, messageId: string) {
  return dispatch('message:delete', channelId, { messageId });
}
