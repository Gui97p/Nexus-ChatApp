import z from 'zod';
import Schemas from '../../utils/schema';

export const serverSchemas = {
  getById: {
    params: Schemas.cuidParam,
  },

  create: {
    body: z.object({
      name: Schemas.stringCheck('Name'),
    }),
  },

  createChannel: {
    params: Schemas.cuidParam,
    body: z.object({
      name: Schemas.stringCheck('Name'),
      type: z.enum(['category', 'text']),
      parentId: z.string().cuid().optional(),
    }),
  },

  update: {
    params: Schemas.cuidParam,
    body: z
      .object({
        name: z.string(),
        description: z.string(),
        icon: z.string().cuid(),
      })
      .partial(),
  },

  delete: {
    params: Schemas.cuidParam,
  },
};
