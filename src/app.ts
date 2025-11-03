import Fastify, { FastifyReply, FastifyRequest } from 'fastify';
import fjwt from 'fastify-jwt';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import ratelimit from '@fastify/rate-limit';
import { Server } from 'socket.io';
import { registerUserRoutes } from './modules/user/user.route';
import { registerAuthRoutes } from './modules/auth/auth.route';
import { registerMessageRoutes } from './modules/message/message.route';
import { setupWebSocket } from './websockets';
import { setupSwagger } from './plugins/swagger';
import { registerSchemas } from './plugins/registerSchemas';
import { registerFileRoutes } from './modules/file/file.route';

declare module 'fastify-jwt' {
  interface FastifyJWT {
    payload: { userId: string };
    user: { userId: string };
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    io: Server;
  }
}

async function buildApp() {
  const app = Fastify({
    logger: {
      level: 'info',
    },
    ajv: {
      customOptions: {
        strict: false,
      },
    },
  });

  app.get('/ping', async () => ({ message: 'pong!' }));

  app.register(cors, {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    credentials: true,
  });
  app.register(fjwt, {
    secret: process.env.JWT_SECRET || 'defaultsecret',
    sign: { expiresIn: '1y' },
  });
  app.register(multipart, {
    limits: {
      fileSize: 1024 * 1024 * 10,
      files: 10,
    },
  });
  await app.register(ratelimit, {
    global: false,
    max: 300,
    timeWindow: '5 minutes',
    errorResponseBuilder: (req, context) => ({
      error: 'RateLimitExceeded',
      message: `Try again in ${Math.ceil(context.ttl / 1000)} seconds`,
      retryAfter: context.ttl,
    }),
  });

  app.setNotFoundHandler(
    {
      preHandler: app.rateLimit({
        max: 4,
        timeWindow: 500,
      }),
    },
    (req: FastifyRequest, res: FastifyReply) => {
      res.status(404).send({ message: `Route ${req.method} ${req.url} not found` });
    },
  );

  app.setErrorHandler((error, req: FastifyRequest, res: FastifyReply) => {
    req.log.error(error.stack);
    res.status(500).send({ message: 'Internal server error' });
  });

  await registerSchemas(app);
  await setupSwagger(app);
  app.register(setupWebSocket);

  app.register(registerUserRoutes, { prefix: '/api/users' });
  app.register(registerAuthRoutes, { prefix: '/api/auth' });
  app.register(registerMessageRoutes, { prefix: '/api/messages' });
  app.register(registerFileRoutes, { prefix: '/api/files' });

  return app;
}

export default buildApp;
