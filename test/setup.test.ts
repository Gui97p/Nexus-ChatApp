import { beforeAll, afterAll } from 'vitest';
import prisma from '../src/utils/prisma';
import app from '../src/app';
import { randomUUID } from 'crypto';

declare global {
  var token: string;
}

beforeAll(async () => {
  await app.ready()

  await prisma.$transaction(async (tx) => {
    await tx.message.deleteMany();
    await tx.user.deleteMany();

    const uniqueEmail = `user_${randomUUID()}@example.com`;
    const uniqueName = `User${randomUUID()}`;
    const user = await prisma.user.create({
      data: { name: uniqueName, email: uniqueEmail, password: 'senha1234' },
    });

    global.token = app.jwt.sign({ userId: user.id });
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
