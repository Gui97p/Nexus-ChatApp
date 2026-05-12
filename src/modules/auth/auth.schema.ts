import { z } from 'zod';

function stringCheck(name: string) {
  return z.string({
    required_error: `${name} is required`,
    invalid_type_error: `${name} must be a string`,
  });
}

export const authSchemas = {
  login: {
    body: z.object({
      email: stringCheck('Email').email({
        message: 'Invalid email address',
      }),
      password: z.string(stringCheck('Password')),
    }),
  },
};
