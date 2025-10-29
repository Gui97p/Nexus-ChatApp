import { InferRequest } from '../../utils/zodValidate';
import { authSchemas } from './auth.schema';

export type LoginRequest = InferRequest<typeof authSchemas.login>;
