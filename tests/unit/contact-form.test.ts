import { describe, expect, it } from 'vitest';

import { contactSchema } from '@/features/forms/contact';

describe('contact schema', () => {
  it('rejects invalid email', () => {
    const result = contactSchema.safeParse({
      name: 'A',
      email: 'bad-email',
      content: 'hello'
    });

    expect(result.success).toBe(false);
  });
});
