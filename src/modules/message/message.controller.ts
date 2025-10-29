import { FastifyReply, FastifyRequest } from 'fastify';
import {
  createMessage,
  deleteMessage,
  getMessageById,
  getMessages,
  getMessagesByAuthor,
  getMessagesByIds,
  updateMessage,
} from './message.service';
import { getSocketServer } from '../../utils/socket';
import {
  CreateMessageRequest,
  DeleteMessageRequest,
  getAllMessages,
  getMessageByAuthorRequest,
  getMessageByIdRequest,
  UpdateMessageRequest,
} from './message.types';

export async function getMessagesHandler(req: FastifyRequest<getAllMessages>, res: FastifyReply) {
  const { limit, before, after, order } = req.query;

  const messages = await getMessages({ limit, before, after, order });

  return res.send({ message: messages });
}

export async function getMessagesByAuthorHandler(
  req: FastifyRequest<getMessageByAuthorRequest>,
  res: FastifyReply,
) {
  const { id } = req.params;
  const { limit, before, after, order } = req.query;

  const messages = await getMessagesByAuthor(id, { limit, before, after, order });

  return res.send({ message: messages });
}

export async function getMessageHandler(
  req: FastifyRequest<getMessageByIdRequest>,
  res: FastifyReply,
) {
  const { id } = req.params;

  const message = await getMessageById(id);

  if (!message) {
    return res.status(404).send({ message: 'Message not found' });
  }

  return res.send({ message });
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

  return res.code(201).send({ message: newMessage, ignoredReplies });
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

  return res.send({ message: updatedMessage });
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
