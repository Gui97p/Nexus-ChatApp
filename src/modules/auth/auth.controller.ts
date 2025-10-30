import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { findSensitiveByEmail } from '../user/user.service';
import bcrypt from 'bcrypt';
import { LoginRequest } from './auth.types';

export async function authHandler(
  app: FastifyInstance,
  req: FastifyRequest<LoginRequest>,
  res: FastifyReply,
) {
  const { email, password } = req.body;

  const user = await findSensitiveByEmail(email);
  if (!user) {
    return res.status(401).send({ message: 'Invalid email or password' });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).send({ message: 'Invalid email or password' });
  }

  return app.jwt.sign({ userId: user.id }, (err, token) => {
    if (err) {
      return res.status(500).send({ message: 'Could not generate token' });
    }
    return res.send({ token });
  });
}
