import { InferRequest } from '../../utils/zodValidate';
import { ChannelsSchema } from './channels.schema';

export type CreateChannelRequest = InferRequest<typeof ChannelsSchema.createChannel>;
export type CreateGroupRequest = InferRequest<typeof ChannelsSchema.createGroup>;
export type GetChannelByIdRequest = InferRequest<typeof ChannelsSchema.getChannelById>;
export type UpdateChannelByIdRequest = InferRequest<typeof ChannelsSchema.updateChannelById>;
export type DeleteChannelByIdRequest = InferRequest<typeof ChannelsSchema.deleteChannelById>;

export type CreateChannelMembersRequest = InferRequest<typeof ChannelsSchema.createChannelMembers>;
export type DeleteChannelMemberRequest = InferRequest<typeof ChannelsSchema.deleteChannelMember>;

export type ActivateChannelRequest = InferRequest<typeof ChannelsSchema.activateChannel>;
export type DeactivateChannelRequest = InferRequest<typeof ChannelsSchema.deactivateChannel>;

export type getAllMessages = InferRequest<typeof ChannelsSchema.getMessagesByChannel>;
export type CreateMessageRequest = InferRequest<typeof ChannelsSchema.createMessage>;
