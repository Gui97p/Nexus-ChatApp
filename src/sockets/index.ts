import { FastifyInstance } from 'fastify';
import { Server } from 'socket.io';
import { SocketAuthMiddleware } from './middlewares/auth.middleware';
import { setSocketServer } from '../utils/socket';
import { registerRoomEvents } from './handlers/room.handler';
import {
  onStatusConnect,
  onStatusDisconnect,
  registerStatusEvents,
} from './handlers/status.handler';

export async function setupWebSocket(app: FastifyInstance) {
  const server = new Server(app.server, {
    cors: {
      origin: '*',
    },
  });

  server.use((socket, next) => SocketAuthMiddleware(app, socket, next));

  server.on('connection', (socket) => {
    console.log(`User connected: ${socket.data.userId}`);
    socket.join(`user:${socket.data.userId}`);

    socket.on('ping', () => {
      socket.emit('pong', { message: 'pong' });
    });

    onStatusConnect(socket);

    registerRoomEvents(socket);
    registerStatusEvents(server, socket);

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.data.userId}`);
      socket.leave(`user:${socket.data.userId}`);

      onStatusDisconnect(socket);
    });
  });

  setSocketServer(server);
  app.addHook('onClose', async () => {
    server.close();
  });
}
