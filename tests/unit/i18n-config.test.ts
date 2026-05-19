import { describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';

import { defaultLocale, locales } from '@/lib/i18n/config';
import { ADMIN_SESSION_COOKIE } from '@/lib/auth-constants';
import { middleware } from '../../middleware';

describe('i18n config', () => {
  it('supports four locales', () => {
    expect(locales).toEqual(['zh-CN', 'en', 'es', 'pt']);
    expect(defaultLocale).toBe('es');
  });

  it('redirects unprefixed product pages to the Spanish storefront by default', () => {
    const response = middleware(new NextRequest('http://localhost/products'));

    expect(response?.headers.get('location')).toBe('http://localhost/es/products');
  });

  it('redirects the storefront root to Spanish even when the browser prefers another supported language', () => {
    const request = new NextRequest('http://localhost/', {
      headers: {
        'accept-language': 'zh-CN,zh;q=0.9'
      }
    });
    const response = middleware(request);

    expect(response?.headers.get('location')).toBe('http://localhost/es');
  });

  it('resets the admin entry locale cookie to Spanish on direct admin entry', () => {
    const request = new NextRequest('http://localhost/admin', {
      headers: {
        cookie: `${ADMIN_SESSION_COOKIE}=session-token; ADMIN_LOCALE=zh-CN`
      }
    });
    const response = middleware(request);

    expect(response?.headers.get('set-cookie')).toContain('ADMIN_LOCALE=es');
  });
});
