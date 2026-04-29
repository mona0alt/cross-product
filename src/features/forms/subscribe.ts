import { z } from 'zod';

import { db } from '@/lib/db';

export const subscribeSchema = z.object({
  email: z.string().trim().email(),
  source: z.string().trim().min(1).optional()
});

export async function createSubscriber(
  input: z.infer<typeof subscribeSchema>
) {
  const payload = subscribeSchema.parse(input);

  return db.subscriber.upsert({
    where: {
      email: payload.email
    },
    update: {
      status: 'active',
      source: payload.source
    },
    create: {
      email: payload.email,
      status: 'active',
      source: payload.source
    }
  });
}
