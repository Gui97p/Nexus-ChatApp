import { beforeAll, afterAll } from 'vitest';
import prisma from '../src/utils/prisma';
import { setSocketServer } from '../src/utils/socket';
import app from '../src/app';
import { randomUUID } from 'crypto';

declare global {
  var token: string;
  var authorId: string;
}

beforeAll(async () => {
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "Message" CASCADE');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "User" CASCADE');

  const ioMock = {
    emit: () => {},
    on: () => {},
    to: () => {
      return {
        emit: () => {}
      }
    }
  };

  setSocketServer(ioMock as any);

  await app.ready()
  //await prisma.message.deleteMany();
  //await prisma.user.deleteMany();

  await prisma.$transaction(async (tx) => {
    if (!global.token) {
      const uniqueEmail = `user_${randomUUID()}@example.com`;
      const uniqueName = `User${randomUUID()}`;
      const user = await prisma.user.create({
        data: { name: uniqueName, email: uniqueEmail, password: 'senha1234' },
      });
  
      global.token = app.jwt.sign({ userId: user.id });
      global.authorId = user.id;

      const message = await prisma.message.create({
        data: {
          content: 'test message',
          authorId: user.id
        }
      })
    }
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
