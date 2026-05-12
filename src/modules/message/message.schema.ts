import { z } from 'zod';
import Schema from '../../utils/schema';

export const MessageSchemas = {
  getById: {
    params: Schema.cuidParam,
  },

  update: {
    body: z.object({
      content: z
        .string()
        .min(1, 'Content cannot be empty')
        .max(2000, 'Content cannot exceed 2000 characters'),
    }),
    params: Schema.cuidParam,
  },

  delete: {
    params: Schema.cuidParam,
  },
} as const;
