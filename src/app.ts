import Fastify from 'fastify';
import fjwt from 'fastify-jwt';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
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
    logger: true,
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
