import { ISignedUser } from '../../user/interface/ISingedUser';

export interface IValidationPayload extends ISignedUser {
  readonly iat: number;
  readonly exp: number;
  readonly sub: string;
  readonly jti?: string;
}
