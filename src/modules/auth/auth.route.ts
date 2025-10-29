import { FastifyInstance } from 'fastify';
import { authHandler } from './auth.controller';
import { zodValidate } from '../../utils/zodValidate';
import { authSchemas } from './auth.schema';
import { AuthDocs } from './auth.docs';

export async function registerAuthRoutes(app: FastifyInstance) {
  app.post(
    '/',
    { preHandler: zodValidate(authSchemas.login), schema: AuthDocs.login },
    authHandler,
  );
}
