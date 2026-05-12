import { FastifyInstance } from 'fastify';
import { Socket } from 'socket.io';

export async function SocketAuthMiddleware(
  app: FastifyInstance,
  socket: Socket,
  next: (err?: Error) => void,
) {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Authentication error: Token is required'));
    }

    const decoded = app.jwt.verify<{
      userId: string;
      iat?: number;
      exp?: number;
    }>(token);

    if (!decoded) {
      return next(new Error('Authentication error: Invalid token'));
    }

    socket.data.userId = decoded.userId;

    next();
  } catch {
    next(new Error('Authentication error: Invalid token'));
  }
}
