import { FastifyInstance } from 'fastify';
import { createFilesHandler } from './file.controller';

export function registerFileRoutes(app: FastifyInstance) {
  app.post('/', {}, createFilesHandler);
}
