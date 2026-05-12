import { Socket } from 'socket.io';

export function registerRoomEvents(socket: Socket) {
  socket.on('server:focus', (serverId: string) => {
    const rooms = Array.from(socket.rooms);
    rooms.forEach((room) => {
      if (room.startsWith('server:') && room !== `server:${serverId}`) {
        socket.leave(room);
        console.log(`User ${socket.data.userId} left server room ${room.split(':')[1]}`);
      }
    });
    socket.join(`server:${serverId}`);
    console.log(`User ${socket.data.userId} joined server room`);
  });

  socket.on('server:unfocus', (serverId: string) => {
    socket.leave(`server:${serverId}`);
    console.log(`User ${socket.data.userId} left server room`);
  });

  socket.on('channel:focus', (channelId: string) => {
    const rooms = Array.from(socket.rooms);
    rooms.forEach((room) => {
      if (room.startsWith('channel:') && room !== `channel:${channelId}`) {
        socket.leave(room);
        console.log(`User ${socket.data.userId} left channel ${room.split(':')[1]}`);
      }
    });

    socket.join(`channel:${channelId}`);
    console.log(`User ${socket.data.userId} joined channel ${channelId}`);
  });

  socket.on('channel:unfocus', (channelId: string) => {
    socket.leave(`channel:${channelId}`);
    console.log(`User ${socket.data.userId} left channel ${channelId}`);
  });
}
