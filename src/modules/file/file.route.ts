import { FastifyInstance } from 'fastify';
import { createFilesHandler } from './file.controller';
import { fileDocs } from './file.docs';

export function registerFileRoutes(app: FastifyInstance) {
  app.post('/', { schema: fileDocs.create }, createFilesHandler);
}
