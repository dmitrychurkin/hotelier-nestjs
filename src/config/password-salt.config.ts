import { registerAs } from '@nestjs/config';

export default registerAs('password', () => ({
  salt: process.env.PASSWORD_SALT_ROUNDS,
}));
