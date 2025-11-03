import { FastifyReply, FastifyRequest } from 'fastify';
import {
  createUser,
  deleteUser,
  findUserByEmail,
  findUserById,
  findUserByName,
  findUsers,
  updateUser,
} from './user.service';
import {
  GetUserByIdRequest,
  CreateUserRequest,
  UpdateUserRequest,
  DeleteUserRequest,
} from './user.types';
import { findFileById } from '../file/file.service';

export async function getUsersHandler(req: FastifyRequest, res: FastifyReply) {
  const users = await findUsers();

  for (const user of users) {
    if (!user.avatar) continue;
    user.avatar = (await findFileById(user.avatar))?.url || null;
  }

  return res.send({ data: users });
}

export async function getMeHandler(req: FastifyRequest, res: FastifyReply) {
  const userId = req.user.userId;

  const user = await findUserById(userId);

  if (!user) {
    return res.status(404).send({ message: 'User not found' });
  }

  if (user.avatar) {
    user.avatar = (await findFileById(user.avatar))?.url || null;
  }

  return res.send({ data: user });
}

export async function getUserHandler(req: FastifyRequest<GetUserByIdRequest>, res: FastifyReply) {
  const { id } = req.params;

  const user = await findUserById(id);

  if (!user) {
    return res.status(404).send({ message: 'User not found' });
  }

  if (user.avatar) {
    user.avatar = (await findFileById(user.avatar))?.url || null;
  }

  return res.send({ data: user });
}

export async function createUserHandler(req: FastifyRequest<CreateUserRequest>, res: FastifyReply) {
  const body = req.body;

  let existingUser = await findUserByEmail(body.email);
  if (existingUser) {
    return res.status(409).send({ message: 'Email already in use' });
  }
  existingUser = await findUserByName(body.name);
  if (existingUser) {
    return res.status(409).send({ message: 'Username already in use' });
  }

  const user = await createUser(body);

  return res.status(201).send({ data: user });
}

export async function updateUserHandler(req: FastifyRequest<UpdateUserRequest>, res: FastifyReply) {
  const { id } = req.params;
  const body = req.body;
  const userId = req.user.userId;

  if (userId !== id) {
    return res.status(403).send({ message: 'You can only update your own account' });
  }

  if (body.email) {
    const existingUser = await findUserByEmail(body.email);
    if (existingUser) {
      return res.status(409).send({ message: 'Email already in use' });
    }
  }
  if (body.name) {
    const existingUser = await findUserByName(body.name);
    if (existingUser) {
      return res.status(409).send({ message: 'Username already in use' });
    }
  }

  try {
    await updateUser(id, body);
    return res.send({ message: 'User updated successfully' });
  } catch {
    return res.status(404).send({ message: 'User not found' });
  }
}

export async function deleteUserHandler(req: FastifyRequest<DeleteUserRequest>, res: FastifyReply) {
  const { id } = req.params as { id: string };
  const userId = req.user.userId;

  if (userId !== id) {
    return res.status(403).send({ message: 'You can only delete your own account' });
  }

  try {
    await deleteUser(id);
    return res.status(200).send({ message: 'User deleted successfully' });
  } catch {
    return res.status(404).send({ message: 'User not found' });
  }
}
