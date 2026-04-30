import { describe, expect, it } from 'vitest';

import HomePage from '@/app/page';
import { defaultLocale } from '@/lib/i18n/config';

describe('HomePage', () => {
  it('redirects to the default locale storefront', () => {
    try {
      HomePage();
      throw new Error('Expected redirect to throw');
    } catch (error) {
      expect(error).toMatchObject({
        digest: expect.stringContaining(`/${defaultLocale}`)
      });
    }
  });
});
