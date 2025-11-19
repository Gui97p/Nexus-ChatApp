import { Socket } from 'socket.io';

export function getSocketActualChannel(socket: Socket): string | undefined {
  const rooms = Array.from(socket.rooms);
  for (const room of rooms) {
    if (room.startsWith('channel:')) {
      return room;
    }
  }
}
