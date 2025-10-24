import { Server } from 'socket.io';

let io: Server | null = null;

export function setSocketServer(instance: Server) {
  io = instance;
}

export function getSocketServer(): Server {
  if (!io) {
    throw new Error('Socket.IO instance not initialized');
  }
  return io;
}