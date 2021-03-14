import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ISignedUser } from '../../user/interface/ISingedUser';
import { ConfigService } from '@nestjs/config';
import { IValidationPayload } from '../interface/IValidationPayload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('auth.jwtSecret'),
    });
  }

  validate({ name, email, role, jti }: IValidationPayload): ISignedUser {
    return {
      tokenId: jti,
      name,
      email,
      role,
    };
  }
}
