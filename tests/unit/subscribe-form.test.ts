import { describe, expect, it } from 'vitest';

import { subscribeSchema } from '@/features/forms/subscribe';

describe('subscribe schema', () => {
  it('rejects invalid email', () => {
    const result = subscribeSchema.safeParse({
      email: 'bad-email'
    });

    expect(result.success).toBe(false);
  });
});
