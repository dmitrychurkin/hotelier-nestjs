import { Field, InputType } from '@nestjs/graphql';
import { MaxLength, IsEmail, IsNotEmpty } from 'class-validator';
import {
  USER_EMAIL_MAX_LENGTH,
  USER_PASSWORD_MAX_LENGTH,
} from '../const/validation.const';

@InputType()
export class UserSignInInput {
  @Field()
  @MaxLength(USER_PASSWORD_MAX_LENGTH)
  @IsNotEmpty()
  readonly password: string;

  @Field()
  @IsEmail()
  @MaxLength(USER_EMAIL_MAX_LENGTH)
  @IsNotEmpty()
  readonly email: string;
}
