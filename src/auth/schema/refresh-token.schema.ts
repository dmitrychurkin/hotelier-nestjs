import { ConfigService } from '@nestjs/config';
import * as mongoose from 'mongoose';
import ms from 'ms';
import { User } from '../../user/schema/user.schema';

export const RefreshTokenModelName = 'RefreshToken';

export type RefreshTokenDocument = {
  readonly owner: string;
} & mongoose.Document;

export default (configService: ConfigService) =>
  new mongoose.Schema({
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User.name,
    },
    createdAt: {
      type: mongoose.Schema.Types.Date,
      default: Date.now,
      expires:
        ms(configService.get<string>('auth.jwtRefreshTokenExpiresIn')) / 1000,
    },
  });
