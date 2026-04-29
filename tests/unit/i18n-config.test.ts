import { describe, expect, it } from 'vitest';

import { defaultLocale, locales } from '@/lib/i18n/config';

describe('i18n config', () => {
  it('supports four locales', () => {
    expect(locales).toEqual(['zh-CN', 'en', 'es', 'pt']);
    expect(defaultLocale).toBe('zh-CN');
  });
});
