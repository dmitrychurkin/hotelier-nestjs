import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  jwtSecret: process.env.AUTH_JWT_SECRET,
  jwtAlgorithm: process.env.AUTH_JWT_ALGORITHM,
  jwtAccessTokenExpiresIn: process.env.AUTH_JWT_ACCESS_TOKEN_EXPIRES_IN,
  jwtRefreshTokenExpiresIn: process.env.AUTH_JWT_REFRESH_TOKEN_EXPIRES_IN,
  accessTokenHeaderName: process.env.AUTH_ACCESS_TOKEN_HEADER_NAME,
  refreshTokenHeaderName: process.env.AUTH_REFRESH_TOKEN_HEADER_NAME,
}));
