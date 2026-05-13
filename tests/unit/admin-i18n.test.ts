import { beforeEach, describe, expect, it, vi } from 'vitest';

const cookiesMock = vi.fn();

vi.mock('next/headers', () => ({
  cookies: cookiesMock
}));

describe('admin i18n', () => {
  beforeEach(() => {
    vi.resetModules();
    cookiesMock.mockReset();
  });

  it('falls back to zh-CN for unsupported admin locale cookies', async () => {
    cookiesMock.mockResolvedValue({
      get: () => ({ value: 'fr' })
    });

    const { getAdminLocale } = await import('@/lib/admin-i18n');

    await expect(getAdminLocale()).resolves.toBe('zh-CN');
  });

  it('loads the admin dictionary for a supported admin locale cookie', async () => {
    cookiesMock.mockResolvedValue({
      get: () => ({ value: 'en' })
    });

    const { getAdminDictionary } = await import('@/lib/admin-i18n');
    const dictionary = await getAdminDictionary();

    expect(dictionary.locale).toBe('en');
    expect(dictionary.Admin.nav.products).toBe('Products');
    expect(dictionary.Admin.nav.categories).toBe('Settings');
    expect(dictionary.Admin.common.upload).toBe('Upload image');
  });
});
