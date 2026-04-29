import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  ADMIN_USERNAME: z.string().min(1),
  ADMIN_PASSWORD: z.string().min(1),
  WHATSAPP_NUMBER: z.string().min(1),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development')
});

export type Env = z.infer<typeof envSchema>;

let cachedEnv: Env | null = null;

export function getEnv(): Env {
  if (!cachedEnv) {
    cachedEnv = envSchema.parse(process.env);
  }

  return cachedEnv;
}

export const env = new Proxy({} as Env, {
  get(_target, prop: keyof Env) {
    return getEnv()[prop];
  }
});
