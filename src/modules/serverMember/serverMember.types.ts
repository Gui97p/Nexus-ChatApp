import { InferRequest } from '../../utils/zodValidate';
import { serverMemberSchemas } from './serverMember.schema';

export type GetServerMembersByServerIdRequest = InferRequest<
  typeof serverMemberSchemas.getByServerId
>;
export type GetServerMemberByMemberIdRequest = InferRequest<
  typeof serverMemberSchemas.getByMemberId
>;
export type CreateServerMemberRequest = InferRequest<typeof serverMemberSchemas.create>;
export type UpdateServerMemberRequest = InferRequest<typeof serverMemberSchemas.update>;
export type DeleteServerMemberRequest = InferRequest<typeof serverMemberSchemas.delete>;
