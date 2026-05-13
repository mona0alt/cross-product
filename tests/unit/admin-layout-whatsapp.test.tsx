import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/auth', () => ({
  requireAdminSession: vi.fn().mockResolvedValue({
    username: 'admin'
  })
}));

vi.mock('@/lib/admin-i18n', () => ({
  getAdminDictionary: vi.fn().mockResolvedValue({
    locale: 'en',
    Admin: {
      common: {
        language: 'Language'
      },
      shell: {
        role: 'Administrator',
        logout: 'Logout'
      },
      nav: {
        analytics: 'Analytics',
        products: 'Products',
        banners: 'Banners',
        subscribers: 'Subscribers',
        messages: 'Messages',
        categories: 'Categories'
      }
    }
  })
}));

vi.mock('@/components/admin/admin-nav', () => ({
  AdminNav: () => <div data-testid="mock-admin-nav" />
}));

vi.mock('@/components/admin/admin-shell-header', () => ({
  AdminShellHeader: () => <div data-testid="mock-admin-header" />
}));

describe('admin protected layout', () => {
  it('does not render the storefront floating WhatsApp CTA', async () => {
    const AdminProtectedLayout =
      (await import('@/app/admin/(protected)/layout')).default;
    const html = renderToStaticMarkup(
      await AdminProtectedLayout({
        children: <div>admin page</div>
      })
    );

    expect(html).toContain('data-testid="mock-admin-nav"');
    expect(html).toContain('data-testid="mock-admin-header"');
    expect(html).not.toContain('storefront-floating-whatsapp-button');
  });
});
