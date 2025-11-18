import { FastifyReply, FastifyRequest } from 'fastify';
import {
  ActivateChannelRequest,
  CreateChannelMembersRequest,
  CreateChannelRequest,
  CreateGroupRequest,
  DeactivateChannelRequest,
  DeleteChannelByIdRequest,
  DeleteChannelMemberRequest,
  GetChannelByIdRequest,
  UpdateChannelByIdRequest,
} from './channel.types';
import {
  addActiveChannel,
  createChannel,
  deleteChannelById,
  getActiveChannelsByUserId,
  getChannelById,
  removeActiveChannel,
  updateChannelById,
} from './channel.service';
import { findUserById } from '../user/user.service';
import {
  createChannelMemberBulk,
  deleteChannelMember,
  getChannelMember,
} from '../channelMember/channelMember.service';

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

  const channel = await getChannelById(channelId);
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

  const channel = await getChannelById(channelId);
  if (!channel) {
    return res.status(404).send({ message: 'Channel not found' });
  }

  const updatedChannel = await updateChannelById(channelId, body);
  return res.status(200).send({ data: updatedChannel });
}

export async function deleteChannelByIdHandler(
  req: FastifyRequest<DeleteChannelByIdRequest>,
  res: FastifyReply,
) {
  const channelId = req.params.id;

  const channel = await getChannelById(channelId);
  if (!channel) {
    return res.status(404).send({ message: 'Channel not found' });
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

  const channel = await getChannelById(channelId);
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

  const channel = await getChannelById(channelId);
  if (!channel) {
    return res.status(404).send({ message: 'Channel not found' });
  }

  const channelMember = await getChannelMember(channelId, memberId);
  if (!channelMember) {
    return res.status(404).send({ message: 'Channel member not found' });
  }

  await deleteChannelMember(channelId, memberId);
  return res.send({ data: 'Channel member deleted successfully' });
}

export async function getActiveChannelsHandler(req: FastifyRequest, res: FastifyReply) {
  const userId = req.user.userId;

  const activeChannels = await getActiveChannelsByUserId(userId);
  return res.status(200).send({ data: activeChannels });
}

export async function activateChannelHandler(
  req: FastifyRequest<ActivateChannelRequest>,
  res: FastifyReply,
) {
  const userId = req.user.userId;
  const channelId = req.params.id;

  const channel = await getChannelById(channelId);
  if (!channel) {
    return res.status(404).send({ message: 'Channel not found' });
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

  const channel = await getChannelById(channelId);
  if (!channel) {
    return res.status(404).send({ message: 'Channel not found' });
  }

  await removeActiveChannel(userId, channelId);
  return res.status(200).send({ data: 'Channel deactivated successfully' });
}
