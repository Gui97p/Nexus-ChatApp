import z from 'zod';

export const fileSchemas = {
  upload: z.object({
    attachments: z.array(z.instanceof(File)).max(10),
  }),
};
