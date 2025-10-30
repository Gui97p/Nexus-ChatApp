import { FastifyInstance } from 'fastify';
import { authHandler } from './auth.controller';
import { zodValidate } from '../../utils/zodValidate';
import { authSchemas } from './auth.schema';
import { AuthDocs } from './auth.docs';
import { LoginRequest } from './auth.types';

export async function registerAuthRoutes(app: FastifyInstance) {
  app.post<LoginRequest>(
    '/',
    { preHandler: zodValidate(authSchemas.login), schema: AuthDocs.login },
    (req, res) => authHandler(app, req, res),
  );
}
