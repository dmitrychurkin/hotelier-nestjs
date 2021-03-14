import Role from '../enum/user-roles.enum';

export interface ISignedUser {
  readonly id?: string;
  readonly tokenId?: string;
  readonly name: string;
  readonly email: string;
  readonly role: Role;
}
