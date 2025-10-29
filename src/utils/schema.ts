import { z } from 'zod';

const Schemas = {
  cuidParam: z.object({
    id: z.string().cuid(),
  }),
  idOrDate: z
    .string()
    .refine(
      (value) => {
        if (z.string().cuid().safeParse(value).success) return true;
        const date = new Date(value);
        return !isNaN(date.getTime());
      },
      { message: 'Must be a valid CUID or ISO date string' },
    )
    .transform((value) => {
      if (z.string().cuid().safeParse(value).success) {
        return { type: 'id' as const, value };
      } else {
        return { type: 'date' as const, value: new Date(value) };
      }
    }),
};

export default Schemas;
