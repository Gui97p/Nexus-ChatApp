import { FastifyReply, FastifyRequest } from "fastify";
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
}
