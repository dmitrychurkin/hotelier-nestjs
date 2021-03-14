import { Field, InputType } from '@nestjs/graphql';
import { MaxLength, IsEnum, IsOptional, IsNotEmpty } from 'class-validator';
import { USER_NAME_MAX_LENGTH } from '../const/validation.const';
import Role from '../enum/user-roles.enum';
import { UserSignInInput } from './user-signin.input';

@InputType()
export class UserSignUpInput extends UserSignInInput {
  @Field()
  @MaxLength(USER_NAME_MAX_LENGTH)
  @IsNotEmpty()
  readonly name: string;

  @Field()
  @IsOptional()
  @IsEnum(Role)
  readonly role?: Role;
}
