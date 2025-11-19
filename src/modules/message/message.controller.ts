import { FastifyReply, FastifyRequest } from 'fastify';
import {
  deleteMessage,
  findMessageById,
  findMessagesByIds,
  findSensitiveById,
  updateMessage,
} from './message.service';
import { getSocketServer } from '../../utils/socket';
import { DeleteMessageRequest, getMessageByIdRequest, UpdateMessageRequest } from './message.types';

export async function getMessageHandler(
  req: FastifyRequest<getMessageByIdRequest>,
  res: FastifyReply,
) {
  const userId = req.user.userId;
  const { id } = req.params;

  const message = await findMessageById(id);

  if (!message) {
    return res.status(404).send({ message: 'Message not found' });
  }

  if (message.private) {
    const sensitiveMessage = await findSensitiveById(message.id);

    const repliedTo = (await findMessagesByIds(sensitiveMessage!.repliedTo.map((v) => v.id))).map(
      (v) => v.authorId,
    );
    const replies = (await findMessagesByIds(sensitiveMessage!.replies.map((v) => v.id))).map(
      (v) => v.authorId,
    );
    const condition =
      sensitiveMessage!.authorId === userId ||
      repliedTo.includes(userId) ||
      replies.includes(userId);

    if (!condition) {
      return res.status(401).send({ message: 'Unauthorized' });
    }
  }

  return res.send({ data: message });
}

export async function updateMessageHandler(
  req: FastifyRequest<UpdateMessageRequest>,
  res: FastifyReply,
) {
  const { id } = req.params;
  const userId = req.user.userId;
  const { content } = req.body;

  const message = await findMessageById(id);

  if (!message) {
    return res.code(404).send({ message: 'Message not found' });
  }

  if (userId !== message.authorId) {
    return res.code(403).send({ message: 'You must be the author of the message to update it' });
  }

  const updatedMessage = await updateMessage(id, content);

  const server = getSocketServer();
  server.to('channel:global').emit('message:updated', updatedMessage);

  return res.send({ message: 'Message updated successfully' });
}

export async function deleteMessageHandler(
  req: FastifyRequest<DeleteMessageRequest>,
  res: FastifyReply,
) {
  const { id } = req.params;
  const userId = req.user.userId;

  const message = await findMessageById(id);

  if (!message) {
    return res.code(404).send({ message: 'Message not found' });
  }

  if (userId !== message.authorId) {
    return res.code(403).send({ message: 'You must be the author of the message to delete it' });
  }

  await deleteMessage(id);

  const server = getSocketServer();
  server.to('channel:global').emit('message:deleted', { id });

  return res.send({ message: 'Message deleted successfully' });
}
