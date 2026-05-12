import z from 'zod';
import Schemas from '../../utils/schema';

export const serverMemberSchemas = {
  getByServerId: {
    params: Schemas.cuidParam,
  },

  getByMemberId: {
    params: z.object({
      id: Schemas.stringCheck('Server ID').cuid(),
      memberId: Schemas.stringCheck('Member ID').cuid(),
    }),
  },

  create: {
    params: Schemas.cuidParam,
    body: z.object({
      memberId: Schemas.stringCheck('Member ID').cuid(),
    }),
  },

  update: {
    params: z.object({
      id: Schemas.stringCheck('Server ID').cuid(),
      memberId: Schemas.stringCheck('Member ID').cuid(),
    }),
    body: z
      .object({
        displayName: Schemas.stringCheck('Avatar').max(100).nullable(),
        avatar: Schemas.stringCheck('Avatar').cuid().nullable(),
        aboutMe: Schemas.stringCheck('About Me').max(500).nullable(),
      })
      .partial(),
  },

  delete: {
    params: z.object({
      id: Schemas.stringCheck('Server ID').cuid(),
      memberId: Schemas.stringCheck('Member ID').cuid(),
    }),
  },
};
