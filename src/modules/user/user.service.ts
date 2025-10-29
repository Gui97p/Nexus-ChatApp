import { CreateUserRequest, UpdateUserRequest } from './user.types';
import prisma from '../../utils/prisma';
import bcrypt from 'bcrypt';

export function findUsers() {
  return prisma.user.findMany({
    omit: {
      password: true,
    },
  });
}

export function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: {
      email,
    },
    omit: {
      password: true,
    },
  });
}

export function findSensitiveByEmail(email: string) {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
}

export function findUserByName(name: string) {
  return prisma.user.findUnique({
    where: {
      name,
    },
    omit: {
      password: true,
    },
  });
}

export function findUserById(id: string) {
  return prisma.user.findUnique({
    where: {
      id,
    },
    omit: {
      password: true,
    },
  });
}

export async function createUser(data: CreateUserRequest['Body']) {
  const { name, email, password } = data;
  const hash = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      name,
      email,
      password: hash,
    },
    omit: {
      password: true,
    },
  });
}

export async function updateUser(id: string, data: UpdateUserRequest['Body']) {
  return prisma.user.update({
    where: {
      id,
    },
    data,
  });
}

export async function deleteUser(id: string) {
  return prisma.user.delete({
    where: {
      id,
    },
  });
}
