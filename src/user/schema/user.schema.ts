import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import {
  USER_EMAIL_MAX_LENGTH,
  USER_NAME_MAX_LENGTH,
  USER_PASSWORD_MAX_LENGTH,
} from '../const/validation.const';
import Role from '../enum/user-roles.enum';

export type UserDocument = User & mongoose.Document;

@Schema()
export class User {
  @Prop({
    type: mongoose.Schema.Types.String,
    trim: true,
    required: true,
    maxlength: USER_NAME_MAX_LENGTH,
  })
  readonly name: string;

  @Prop({
    type: mongoose.Schema.Types.String,
    trim: true,
    required: true,
    unique: true,
    maxlength: USER_EMAIL_MAX_LENGTH,
  })
  readonly email: string;

  @Prop({
    type: mongoose.Schema.Types.String,
    maxlength: USER_PASSWORD_MAX_LENGTH,
    required: true,
  })
  readonly password: string;

  @Prop({
    type: mongoose.Schema.Types.String,
    enum: Object.values(Role).filter((v) => typeof v !== 'number'),
    default: Role.User,
  })
  readonly role: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);
