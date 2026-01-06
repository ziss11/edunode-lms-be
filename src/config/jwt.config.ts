import { registerAs } from '@nestjs/config';
import { z } from 'zod';

const jwtConfigSchema = z.object({
  secret: z.string().min(32),
  expiresIn: z.string().default('1h'),
  refreshSecret: z.string().min(32),
  refreshExpiresIn: z.string().default('7d'),
});

export type JwtConfig = z.infer<typeof jwtConfigSchema>;

export default registerAs('jwt', (): JwtConfig => {
  const config = jwtConfigSchema.parse({
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  });

  return config;
});
