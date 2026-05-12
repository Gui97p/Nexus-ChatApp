import { InferRequest } from '../../utils/zodValidate';
import { serverSchemas } from './server.schema';

export type GetServerByIdRequest = InferRequest<typeof serverSchemas.getById>;
export type CreateServerRequest = InferRequest<typeof serverSchemas.create>;
export type CreateServerChannelRequest = InferRequest<typeof serverSchemas.createChannel>;
export type UpdateServerRequest = InferRequest<typeof serverSchemas.update>;
export type DeleteServerRequest = InferRequest<typeof serverSchemas.delete>;
