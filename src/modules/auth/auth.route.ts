import { FastifyInstance } from 'fastify';
import { authHandler } from './auth.controller';
import { zodValidate } from '../../utils/zodValidate';
import { authSchemas } from './auth.schema';

export async function registerAuthRoutes(app: FastifyInstance) {
  app.post('/', { preHandler: zodValidate(authSchemas.login) }, authHandler);
}
