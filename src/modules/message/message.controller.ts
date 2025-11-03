import { FastifyReply, FastifyRequest } from 'fastify';
import {
  createMessage,
  deleteMessage,
  getMessageById,
  getMessages,
  getMessagesByIds,
  getSensitiveById,
  updateMessage,
} from './message.service';
import { getSocketServer } from '../../utils/socket';
import {
  CreateMessageRequest,
  DeleteMessageRequest,
  getAllMessages,
  getMessageByIdRequest,
  UpdateMessageRequest,
} from './message.types';

export async function getMessagesHandler(req: FastifyRequest<getAllMessages>, res: FastifyReply) {
  const userId = req.user.userId;
  const { limit, before, after, order } = req.query;

  const messages = await getMessages({ userId, limit, before, after, order });

  return res.send({ data: messages });
}

export async function getMessageHandler(
  req: FastifyRequest<getMessageByIdRequest>,
  res: FastifyReply,
) {
  const userId = req.user.userId;
  const { id } = req.params;

  const message = await getMessageById(id);

  if (!message) {
    return res.status(404).send({ message: 'Message not found' });
  }

  if (message.private) {
    const sensitiveMessage = await getSensitiveById(message.id);

    const repliedTo = (await getMessagesByIds(sensitiveMessage!.repliedTo.map((v) => v.id))).map(
      (v) => v.authorId,
    );
    const replies = (await getMessagesByIds(sensitiveMessage!.replies.map((v) => v.id))).map(
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

export async function createMessageHandler(
  req: FastifyRequest<CreateMessageRequest>,
  res: FastifyReply,
) {
  const { replies = [], ...body } = req.body;
  const authorId = req.user.userId;

  const uniqueReplies = Array.from(new Set(replies));

  const existingMessages = await getMessagesByIds(uniqueReplies);
  const validReplyIds = existingMessages.map((m) => m.id);
  const ignoredReplies = uniqueReplies.filter((id) => !validReplyIds.includes(id));

  if (uniqueReplies.length > 0 && validReplyIds.length === 0) {
    return res.status(400).send({ message: 'No valid messages to reply to' });
  }

  const newMessage = await createMessage({
    ...body,
    authorId,
    replies: validReplyIds.map((id) => ({ id })),
  });

  const server = getSocketServer();
  server.to('channel:global').emit('message:new', newMessage);

  return res.code(201).send({ data: newMessage, ignoredReplies });
}

export async function updateMessageHandler(
  req: FastifyRequest<UpdateMessageRequest>,
  res: FastifyReply,
) {
  const { id } = req.params;
  const userId = req.user.userId;
  const { content } = req.body;

  const message = await getMessageById(id);

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

  const message = await getMessageById(id);

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
