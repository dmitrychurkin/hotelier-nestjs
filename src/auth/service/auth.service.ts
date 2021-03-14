import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { Model } from 'mongoose';
import { ISignedUser } from '../../user/interface/ISingedUser';
import {
  RefreshTokenDocument,
  RefreshTokenModelName,
} from '../schema/refresh-token.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectModel(RefreshTokenModelName)
    private refreshTokenModel: Model<RefreshTokenDocument>,
  ) {}

  deleteRefreshToken(id: string): Promise<RefreshTokenDocument> {
    return this.refreshTokenModel.findByIdAndDelete(id).exec();
  }

  async signAndSetTokensIntoHeader(
    payload: ISignedUser,
    res: Response,
  ): Promise<void> {
    const refreshTokenDoc = await new this.refreshTokenModel({
      owner: payload.id,
    }).save();

    const payloadJwt: ISignedUser = {
      name: payload.name,
      email: payload.email,
      role: payload.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.signToken(payloadJwt, {
        subject: payload.email,
        expiresIn: this.configService.get('auth.jwtAccessTokenExpiresIn'),
      }),
      this.signToken(payloadJwt, {
        subject: payload.email,
        expiresIn: this.configService.get('auth.jwtRefreshTokenExpiresIn'),
        jwtid: refreshTokenDoc.id,
      }),
    ]);

    res.setHeader(
      this.configService.get('auth.accessTokenHeaderName'),
      accessToken,
    );
    res.setHeader(
      this.configService.get('auth.refreshTokenHeaderName'),
      refreshToken,
    );
  }

  private signToken(
    payload: ISignedUser,
    options?: JwtSignOptions,
  ): Promise<string> {
    return this.jwtService.signAsync(payload, {
      algorithm: this.configService.get('auth.jwtAlgorithm'),
      ...options,
    });
  }
}
