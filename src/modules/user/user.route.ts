import { FastifyInstance } from 'fastify';
import {
  createUserHandler,
  deleteUserHandler,
  getMeHandler,
  getUserHandler,
  getUsersHandler,
  updateUserHandler,
} from './user.controller';
import { zodValidate } from '../../utils/zodValidate';
import authenticate from '../../utils/auth';
import { DeleteUserRequest, GetUserByIdRequest, UpdateUserRequest } from './user.types';
import { UserSchemas } from './user.schema';
import { UserDocs } from './user.docs';

export async function registerUserRoutes(app: FastifyInstance) {
  app.get(
    '/',
    {
      preHandler: authenticate,
      schema: UserDocs.getAll,
      config: {
        rateLimit: {
          max: 60,
          timeWindow: '1 minute',
        },
      },
    },
    getUsersHandler,
  );
  app.get<GetUserByIdRequest>(
    '/:id',
    {
      preHandler: [authenticate, zodValidate(UserSchemas.getById)],
      schema: UserDocs.getById,
      config: {
        rateLimit: {
          max: 60,
          timeWindow: '1 minute',
        },
      },
    },
    getUserHandler,
  );
  app.get(
    '/me',
    {
      preHandler: authenticate,
      schema: UserDocs.getMe,
      config: {
        rateLimit: {
          max: 60,
          timeWindow: '1 minute',
        },
      },
    },
    getMeHandler,
  );
  app.post(
    '/',
    {
      preHandler: zodValidate(UserSchemas.create),
      schema: UserDocs.create,
      config: {
        rateLimit: {
          max: 3,
          timeWindow: '10 minutes',
        },
      },
    },
    createUserHandler,
  );
  app.patch<UpdateUserRequest>(
    '/:id',
    {
      preHandler: [authenticate, zodValidate(UserSchemas.update)],
      schema: UserDocs.update,
      config: {
        rateLimit: {
          max: 10,
          timeWindow: '1 hour',
        },
      },
    },
    updateUserHandler,
  );
  app.delete<DeleteUserRequest>(
    '/:id',
    {
      preHandler: [authenticate, zodValidate(UserSchemas.delete)],
      schema: UserDocs.delete,
      config: {
        rateLimit: {
          max: 1,
          timeWindow: '1 hour',
        },
      },
    },
    deleteUserHandler,
  );
}
