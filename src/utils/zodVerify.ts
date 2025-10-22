// utils/zodRoute.ts
import { FastifyReply, FastifyRequest, RouteShorthandOptions } from "fastify";
import { z, ZodTypeAny } from "zod";

export function zodVerify(
  bodySchema?: ZodTypeAny,
  responseSchema?: ZodTypeAny
): RouteShorthandOptions {
  return {
    preHandler: async (req: FastifyRequest, reply: FastifyReply) => {
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
    },
  };
}
