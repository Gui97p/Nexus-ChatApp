import { InferRequest } from '../../utils/zodValidate';
import { UserSchemas } from './user.schema';

export type GetUserByIdRequest = InferRequest<typeof UserSchemas.getById>;
export type CreateUserRequest = InferRequest<typeof UserSchemas.create>;
export type UpdateUserRequest = InferRequest<typeof UserSchemas.update>;
export type DeleteUserRequest = InferRequest<typeof UserSchemas.delete>;
