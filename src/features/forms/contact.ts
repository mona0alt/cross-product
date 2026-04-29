import { z } from 'zod';

import { db } from '@/lib/db';

export const contactSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().email(),
  content: z.string().trim().min(1)
});

export async function createMessage(input: z.infer<typeof contactSchema>) {
  const payload = contactSchema.parse(input);

  return db.message.create({
    data: payload
  });
}
