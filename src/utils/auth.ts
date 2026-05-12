import { FastifyReply, FastifyRequest } from 'fastify';

export default async function authenticate(req: FastifyRequest, reply: FastifyReply) {
  try {
    await req.jwtVerify();
  } catch {
    return reply.code(401).send({ message: 'Unauthorized' });
  }
}
