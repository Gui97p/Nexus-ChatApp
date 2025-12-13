import { FastifyReply, FastifyRequest } from 'fastify';
import { z, ZodTypeAny, ZodError, ZodIssueCode, ZodIssue } from 'zod';

type SchemaSet = {
  body?: ZodTypeAny;
  params?: ZodTypeAny;
  query?: ZodTypeAny;
};

export function zodValidate<T extends SchemaSet>(schemas: T) {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      if (schemas.body) {
        if (!req.body || typeof req.body !== 'object') {
          const customIssue: ZodIssue = {
            code: ZodIssueCode.invalid_type,
            expected: 'object',
            received: typeof req.body,
            path: ['body'],
            message: 'Request body is required and must be a valid JSON object.',
          };

          throw new ZodError([customIssue]);
        }
        req.body = schemas.body.parse(req.body);
      }

      if (schemas.params) {
        req.params = schemas.params.parse(req.params);
      }

      if (schemas.query) {
        req.query = schemas.query.parse(req.query);
      }
    } catch (err) {
      if (err instanceof ZodError) {
        return reply.status(400).send({
          message: 'Invalid request data',
          errors: err.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        });
      }
      throw err;
    }
  };
}

type ExtractSchema<T extends ZodTypeAny | undefined> = T extends ZodTypeAny ? z.infer<T> : unknown;

export type InferRequest<S extends { body?: ZodTypeAny; params?: ZodTypeAny; query?: ZodTypeAny }> =
  {
    Body: ExtractSchema<S['body']>;
    Params: ExtractSchema<S['params']>;
    Querystring: ExtractSchema<S['query']>;
  };
