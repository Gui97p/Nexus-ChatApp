import { InferRequest } from '../../utils/zodValidate';
import { MessageSchemas } from './message.schema';

export type createMessageType = {
  content: string;
  silent?: boolean;
  private?: boolean;
  replies?: { id: string }[];
  authorId: string;
};

export type getMessageByIdRequest = InferRequest<typeof MessageSchemas.getById>;
export type getMessageByAuthorRequest = InferRequest<typeof MessageSchemas.getByAuthor>;
export type CreateMessageRequest = InferRequest<typeof MessageSchemas.create>;
export type UpdateMessageRequest = InferRequest<typeof MessageSchemas.update>;
export type DeleteMessageRequest = InferRequest<typeof MessageSchemas.delete>;
