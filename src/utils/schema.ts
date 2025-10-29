import { z } from 'zod';

const Schemas = {
    cuidParam: z.object({
        id: z.string().cuid()
    })
};

export default Schemas;