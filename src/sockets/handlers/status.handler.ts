import { Server, Socket } from 'socket.io';
import { getSocketActualChannel } from '../utils/getSocketChannel';
import {
  getUserSockets,
  getUserStatus,
  removeUserStatus,
  setUserStatus,
} from '../utils/userStatus';
import { findServersJoinedByUser } from '../../modules/server/server.service';
import { findServerMemberByMemberId } from '../../modules/serverMember/serverMember.service';

export async function onStatusConnect(socket: Socket) {
  const userId = socket.data.userId;
  const sockets = await getUserSockets(userId);
  if (sockets.length > 1) return;

  setUserStatus(userId, 'online');

  const servers = await findServersJoinedByUser(userId);
  servers.forEach((server) => {
    const room = `server:${server.id}`;
    socket.to(room).emit('status:update', { userId, status: getUserStatus(userId) });
  });
}

export async function onStatusDisconnect(socket: Socket) {
  const userId = socket.data.userId;
  const sockets = await getUserSockets(userId);
  if (sockets.length > 0) return;

  const servers = await findServersJoinedByUser(userId);
  servers.forEach((server) => {
    const room = `server:${server.id}`;
    socket.to(room).emit('status:update', { userId, status: 'offline' });
  });

  removeUserStatus(userId);
}

export function registerStatusEvents(server: Server, socket: Socket) {
  socket.on('server:focus', async (serverId: string) => {
    const userId = socket.data.userId;
    const member = findServerMemberByMemberId(serverId, userId);
    if (!member) return;

    const serverRoom = `server:${serverId}`;

    const users = (await server.in(serverRoom).fetchSockets()).map((s) => s.data.userId);
    const statuses = users.map((userId) => ({
      userId,
      status: getUserStatus(userId),
    }));

    socket.emit('status:sync', {
      data: statuses,
    });
  });

  socket.on('status:typing', (isTyping: boolean) => {
    const userId = socket.data.userId;
    console.log(`User ${userId} is ${isTyping ? 'typing...' : 'not typing'}`);

    const room = getSocketActualChannel(socket);
    if (!room) return;

    socket.to(room).emit('status:typing', { userId, isTyping });
  });
}
