import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  name: process.env.DATABASE_NAME,
  uri: process.env.DATABASE_URI,
}));
