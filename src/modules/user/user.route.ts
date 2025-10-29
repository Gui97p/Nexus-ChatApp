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

export async function registerUserRoutes(app: FastifyInstance) {
  app.get('/', { preHandler: authenticate }, getUsersHandler);
  app.get<GetUserByIdRequest>(
    '/:id',
    { preHandler: [authenticate, zodValidate(UserSchemas.geyById)] },
    getUserHandler,
  );
  app.get('/me', { preHandler: authenticate }, getMeHandler);
  app.post('/', { preHandler: zodValidate(UserSchemas.create) }, createUserHandler);
  app.patch<UpdateUserRequest>(
    '/:id',
    { preHandler: [authenticate, zodValidate(UserSchemas.update)] },
    updateUserHandler,
  );
  app.delete<DeleteUserRequest>(
    '/:id',
    { preHandler: [authenticate, zodValidate(UserSchemas.delete)] },
    deleteUserHandler,
  );
}
