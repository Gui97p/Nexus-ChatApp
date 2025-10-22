import { FastifyReply, FastifyRequest } from "fastify";

export async function authenticate(req: FastifyRequest, reply: FastifyReply) {
  try {
    await req.jwtVerify();
  } catch (err) {
    return reply.code(401).send({ message: "Unauthorized" });
  }
}
