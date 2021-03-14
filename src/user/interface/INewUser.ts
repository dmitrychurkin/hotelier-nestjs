import Role from '../enum/user-roles.enum';

export interface INewUser {
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly role?: Role;
}
