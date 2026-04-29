import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

const logLevels: ('query' | 'error' | 'warn')[] =
  process.env.NODE_ENV === 'development'
    ? ['query', 'error', 'warn']
    : ['error'];

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: logLevels
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}
