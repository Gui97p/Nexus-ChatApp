/*import { FastifyReply, FastifyRequest } from "fastify";
import { ZodTypeAny } from "zod";

export default function zodValidate(
  bodySchema?: ZodTypeAny,
  responseSchema?: ZodTypeAny
): (req: FastifyRequest, reply: FastifyReply) => Promise<void> {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    if (bodySchema) {
      const parsed = bodySchema.safeParse(req.body);
      if (!parsed.success) {
        const errors = parsed.error.errors.map(e => ({
          field: e.path.join("."),
          message: e.message,
        }));
        return reply.code(400).send({ message: "Invalid Request Body", errors });
      }
      req.body = parsed.data;
    }

    if (responseSchema) {
      const originalSend = reply.send.bind(reply);
      reply.send = (payload: any) => {
        const parsed = responseSchema.safeParse(payload);
        if (!parsed.success) {
          const errors = parsed.error.errors.map(e => ({
            field: e.path.join("."),
            message: e.message,
          }));
          return originalSend({
            statusCode: 500,
            message: "Invalid Response Data",
            errors,
          });
        }
        return originalSend(parsed.data);
      };
    }
  };
}*/

import { FastifyReply, FastifyRequest } from 'fastify';
import { z, ZodTypeAny, ZodError } from 'zod';

type SchemaSet = {
  body?: ZodTypeAny;
  params?: ZodTypeAny;
  query?: ZodTypeAny;
};

export function zodValidate<T extends SchemaSet>(schemas: T) {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      if (schemas.body) {
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
