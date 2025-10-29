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
  app.get('/', { preHandler: authenticate, schema: UserDocs.getAll }, getUsersHandler);
  app.get<GetUserByIdRequest>(
    '/:id',
    { preHandler: [authenticate, zodValidate(UserSchemas.getById)], schema: UserDocs.getById },
    getUserHandler,
  );
  app.get('/me', { preHandler: authenticate, schema: UserDocs.getMe }, getMeHandler);
  app.post(
    '/',
    { preHandler: zodValidate(UserSchemas.create), schema: UserDocs.create },
    createUserHandler,
  );
  app.patch<UpdateUserRequest>(
    '/:id',
    { preHandler: [authenticate, zodValidate(UserSchemas.update)], schema: UserDocs.update },
    updateUserHandler,
  );
  app.delete<DeleteUserRequest>(
    '/:id',
    { preHandler: [authenticate, zodValidate(UserSchemas.delete)], schema: UserDocs.delete },
    deleteUserHandler,
  );
}
