import { z } from 'zod';
import Schemas from '../../utils/schema';

export const UserSchemas = {
  getById: {
    params: Schemas.cuidParam,
  },

  create: {
    body: z.object({
      name: Schemas.stringCheck('Name').min(3).max(64),
      email: Schemas.stringCheck('Email').email({
        message: 'Invalid email address',
      }),
      password: z
        .string(Schemas.stringCheck('Password'))
        .min(8, 'Password must have 8 or more letters')
        .max(128, 'Password must have 128 or less letters'),
    }),
  },

  update: {
    params: Schemas.cuidParam,
    body: z
      .object({
        name: Schemas.stringCheck('Name').min(3).max(16),
        displayName: Schemas.stringCheck('Display Name').min(1).max(32),
        email: Schemas.stringCheck('Email').email({
          message: 'Invalid email address',
        }),
        avatar: Schemas.stringCheck('Avatar').cuid(),
      })
      .partial(),
  },

  delete: {
    params: Schemas.cuidParam,
  },
} as const;
