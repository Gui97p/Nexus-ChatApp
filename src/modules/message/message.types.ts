import { InferRequest } from '../../utils/zodValidate';
import { MessageSchemas } from './message.schema';

export type createMessageType = {
  content: string;
  silent?: boolean;
  private?: boolean;
  replies?: string[];
  attachments?: string[];
  authorId: string;
  channelId: string;
};

export type getMessageByIdRequest = InferRequest<typeof MessageSchemas.getById>;
export type UpdateMessageRequest = InferRequest<typeof MessageSchemas.update>;
export type DeleteMessageRequest = InferRequest<typeof MessageSchemas.delete>;
