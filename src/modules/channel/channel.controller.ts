import { FastifyReply, FastifyRequest } from 'fastify';
import {
  ActivateChannelRequest,
  CreateChannelMembersRequest,
  CreateChannelRequest,
  CreateGroupRequest,
  CreateMessageRequest,
  DeactivateChannelRequest,
  DeleteChannelByIdRequest,
  DeleteChannelMemberRequest,
  getAllMessages,
  GetChannelByIdRequest,
  UpdateChannelByIdRequest,
} from './channel.types';
import {
  addActiveChannel,
  createChannel,
  deleteChannelById,
  findSensitiveChannelById,
  findActiveChannelsByUserId,
  findChannelById,
  findDmChannelBetweenUsers,
  removeActiveChannel,
  updateChannelById,
} from './channel.service';
import { findUserById } from '../user/user.service';
import {
  createChannelMemberBulk,
  deleteChannelMember,
  findChannelMember,
} from '../channelMember/channelMember.service';
import { findServerById } from '../server/server.service';
import { createMessage, findMessages, findMessagesByIds } from '../message/message.service';
import { findServerMemberByMemberId } from '../serverMember/serverMember.service';
import { dispatchMessage } from '../../sockets/dispatcher/socket.dispatcher';

async function checkUserInChannel(channelId: string, userId: string) {
  const channel = await findSensitiveChannelById(channelId);
  if (!channel) {
    return false;
  }

  if (channel.type === 'DM' || channel.type === 'GROUP_DM') {
    return channel.recipients.map((r) => r.userId).includes(userId);
  } else {
    const server = await findServerById(channel.serverId!);
    if (!server) {
      return false;
    }
    const member = await findServerMemberByMemberId(server.id, userId);
    return !!member;
  }
}

export async function createChannelHandler(
  req: FastifyRequest<CreateChannelRequest>,
  res: FastifyReply,
) {
  const userId = req.user.userId;
  const body = req.body;

  const targetUser = await findUserById(body.recipientId);
  if (!targetUser) {
    return res.status(404).send({ message: 'User recipient not found' });
  }

  const existingChannel = await findDmChannelBetweenUsers(userId, body.recipientId);
  if (existingChannel) {
    return res.status(200).send({ data: existingChannel });
  }

  const channel = await createChannel({
    type: 'DM',
    recipientIds: [userId, body.recipientId],
  });
  return res.status(201).send({ data: channel });
}

export async function createGroupHandler(
  req: FastifyRequest<CreateGroupRequest>,
  res: FastifyReply,
) {
  const userId = req.user.userId;
  const body = req.body;

  const targetUsers = await Promise.all(
    body.recipients.map((recipientId) => findUserById(recipientId)),
  );
  if (targetUsers.includes(null)) {
    return res.status(404).send({ message: 'One or more user recipients not found' });
  }

  const channel = await createChannel({
    type: 'GROUP_DM',
    recipientIds: [userId, ...body.recipients],
  });
  return res.status(201).send({ data: channel });
}

export async function getChannelByIdHandler(
  req: FastifyRequest<GetChannelByIdRequest>,
  res: FastifyReply,
) {
  const channelId = req.params.id;

  const channel = await findChannelById(channelId);
  if (!channel) {
    return res.status(404).send({ message: 'Channel not found' });
  }

  if (channel.recipients.map((r) => r.userId).includes(req.user.userId) === false) {
    return res.status(403).send({ message: 'Unauthorized' });
  }

  return res.status(200).send({ data: channel });
}

export async function getDmByIdHandler(
  req: FastifyRequest<GetChannelByIdRequest>,
  res: FastifyReply,
) {
  const recipientId = req.params.id;
  const userId = req.user.userId;

  const channel = await findDmChannelBetweenUsers(userId, recipientId);
  if (!channel) {
    return res.status(404).send({ message: 'Channel not found' });
  }

  return res.status(200).send({ data: channel });
}

export async function updateChannelByIdHandler(
  req: FastifyRequest<UpdateChannelByIdRequest>,
  res: FastifyReply,
) {
  const channelId = req.params.id;
  const body = req.body;
  const userId = req.user.userId;

  const channel = await findSensitiveChannelById(channelId);
  if (!channel) {
    return res.status(404).send({ message: 'Channel not found' });
  }

  if (channel.type === 'GROUP_DM') {
    if (channel.recipients.map((r) => r.userId).includes(userId) === false) {
      return res.status(403).send({ message: 'Unauthorized' });
    }

    const updatedChannel = await updateChannelById(channelId, {
      name: body.name,
      icon: body.icon,
    });
    return res.status(200).send({
      data: {
        id: updatedChannel.id,
        name: updatedChannel.name,
        icon: updatedChannel.icon,
        ownerId: updatedChannel.ownerId,
        type: updatedChannel.type,
      },
    });
  } else if (channel.type !== 'DM') {
    const server = await findServerById(channel.serverId!);
    if (server?.ownerId !== userId) {
      return res.status(403).send({ message: 'Unauthorized' });
    }

    const updatedChannel = await updateChannelById(channelId, {
      name: body.name,
      parentId: body.parentId,
    });
    return res.status(200).send({
      data: {
        id: updatedChannel.id,
        name: updatedChannel.name,
        type: updatedChannel.type,
        parentId: updatedChannel.parentId,
        serverId: updatedChannel.serverId,
      },
    });
  } else {
    return res.status(400).send({ message: 'DM channels cannot be updated' });
  }
}

export async function deleteChannelByIdHandler(
  req: FastifyRequest<DeleteChannelByIdRequest>,
  res: FastifyReply,
) {
  const channelId = req.params.id;

  const channel = await findSensitiveChannelById(channelId);
  if (!channel) {
    return res.status(404).send({ message: 'Channel not found' });
  }

  if (channel.type === 'GROUP_DM') {
    if (channel.ownerId !== req.user.userId) {
      return res.status(403).send({ message: 'Unauthorized' });
    }
  } else if (channel.type !== 'DM') {
    const server = await findServerById(channel.serverId!);
    if (server?.ownerId !== req.user.userId) {
      return res.status(403).send({ message: 'Unauthorized' });
    }
  } else {
    return res.status(400).send({ message: 'DM channels cannot be deleted' });
  }

  await deleteChannelById(channelId);
  return res.send({ data: 'Channel deleted successfully' });
}

export async function createChannelMembersHandler(
  req: FastifyRequest<CreateChannelMembersRequest>,
  res: FastifyReply,
) {
  const channelId = req.params.id;
  const body = req.body;

  const channel = await findChannelById(channelId);
  if (!channel) {
    return res.status(404).send({ message: 'Channel not found' });
  }

  const targetUsers = await Promise.all(body.memberIds.map((memberId) => findUserById(memberId)));
  if (targetUsers.includes(null)) {
    return res.status(404).send({ message: 'One or more members not found' });
  }

  const channelMembers = await createChannelMemberBulk(channelId, body.memberIds);
  return res.status(201).send({ data: channelMembers });
}

export async function deleteChannelMemberHandler(
  req: FastifyRequest<DeleteChannelMemberRequest>,
  res: FastifyReply,
) {
  const channelId = req.params.id;
  const memberId = req.params.memberId;

  const channel = await findChannelById(channelId);
  if (!channel) {
    return res.status(404).send({ message: 'Channel not found' });
  }

  if (channel.type !== 'GROUP_DM') {
    return res.status(400).send({ message: 'Only Group DM channels can have members deleted' });
  }

  const channelMember = await findChannelMember(channelId, memberId);
  if (!channelMember) {
    return res.status(404).send({ message: 'Channel member not found' });
  }

  if (memberId !== req.user.userId && channel.ownerId !== req.user.userId) {
    return res.status(403).send({ message: 'Unauthorized' });
  }

  await deleteChannelMember(channelId, memberId);
  return res.send({ data: 'Channel member deleted successfully' });
}

export async function getActiveChannelsHandler(req: FastifyRequest, res: FastifyReply) {
  const userId = req.user.userId;

  const activeChannels = await findActiveChannelsByUserId(userId);
  return res.status(200).send({ data: activeChannels });
}

export async function activateChannelHandler(
  req: FastifyRequest<ActivateChannelRequest>,
  res: FastifyReply,
) {
  const userId = req.user.userId;
  const channelId = req.params.id;

  const channel = await findChannelById(channelId);
  if (!channel) {
    return res.status(404).send({ message: 'Channel not found' });
  }

  if (channel.recipients.map((r) => r.userId).includes(userId) === false) {
    return res.status(403).send({ message: 'Unauthorized' });
  }

  await addActiveChannel(userId, channelId);
  return res.status(200).send({ data: 'Channel activated successfully' });
}

export async function deactivateChannelHandler(
  req: FastifyRequest<DeactivateChannelRequest>,
  res: FastifyReply,
) {
  const userId = req.user.userId;
  const channelId = req.params.id;

  const channel = await findChannelById(channelId);
  if (!channel) {
    return res.status(404).send({ message: 'Channel not found' });
  }

  if (channel.recipients.map((r) => r.userId).includes(req.user.userId) === false) {
    return res.status(403).send({ message: 'Unauthorized' });
  }

  await removeActiveChannel(userId, channelId);
  return res.status(200).send({ data: 'Channel deactivated successfully' });
}

export async function getMessagesHandler(req: FastifyRequest<getAllMessages>, res: FastifyReply) {
  const userId = req.user.userId;
  const { limit, before, after, order } = req.query;
  const channelId = req.params.id;

  const channel = await findSensitiveChannelById(channelId);
  if (!channel) {
    return res.status(404).send({ message: 'Channel not found' });
  }

  if (!(await checkUserInChannel(channelId, userId))) {
    return res.status(403).send({ message: 'Unauthorized' });
  }

  const messages = await findMessages({ channelId, userId, limit, before, after, order });

  return res.send({ data: messages });
}

export async function createMessageHandler(
  req: FastifyRequest<CreateMessageRequest>,
  res: FastifyReply,
) {
  const { replies = [], ...body } = req.body;
  const authorId = req.user.userId;
  const channelId = req.params.id;

  const channel = await findSensitiveChannelById(channelId);
  if (!channel) {
    return res.status(404).send({ message: 'Channel not found' });
  }

  if (!(await checkUserInChannel(channelId, authorId))) {
    return res.status(403).send({ message: 'Unauthorized' });
  }

  const uniqueReplies = Array.from(new Set(replies));

  const existingMessages = await findMessagesByIds(uniqueReplies);
  const validReplyIds = existingMessages.map((m) => m.id);
  const ignoredReplies = uniqueReplies.filter((id) => !validReplyIds.includes(id));

  existingMessages.forEach((msg) => {
    if (ignoredReplies.includes(msg.id)) {
      return;
    }
    if (msg.channelId !== channelId) {
      validReplyIds.splice(validReplyIds.indexOf(msg.id), 1);
      ignoredReplies.push(msg.id);
    }
  });

  if (uniqueReplies.length > 0 && validReplyIds.length === 0) {
    return res.status(400).send({ message: 'No valid messages to reply to' });
  }

  const newMessage = await createMessage({
    ...body,
    authorId,
    channelId,
    replies: validReplyIds,
  });

  dispatchMessage(newMessage);

  return res.code(201).send({ data: newMessage, ignoredReplies });
}
