import { z } from 'zod';
import Schemas from '../../utils/schema';

function stringCheck(name: string) {
  return z.string({
    required_error: `${name} is required`,
    invalid_type_error: `${name} must be a string`,
  });
}

export const UserSchemas = {
  geyById: {
    params: Schemas.cuidParam,
  },

  create: {
    body: z.object({
      name: stringCheck('Name').min(3).max(64),
      email: stringCheck('Email').email({
        message: 'Invalid email address',
      }),
      password: z
        .string(stringCheck('Password'))
        .min(8, 'Password must have 8 or more letters')
        .max(128, 'Password must have 128 or less letters'),
    }),
  },

  update: {
    params: Schemas.cuidParam,
    body: z
      .object({
        name: stringCheck('Name').min(3).max(16),
        displayName: stringCheck('Display Name').min(1).max(32),
        email: stringCheck('Email').email({
          message: 'Invalid email address',
        }),
        avatar: stringCheck('Avatar').url(),
      })
      .partial(),
  },

  delete: {
    params: Schemas.cuidParam,
  },
} as const;
