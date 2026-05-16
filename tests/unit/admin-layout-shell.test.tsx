import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

const requireAdminSession = vi.fn();
const cookiesMock = vi.fn();

vi.mock('@/lib/auth', async () => {
  const actual = await vi.importActual<typeof import('@/lib/auth')>('@/lib/auth');

  return {
    ...actual,
    requireAdminSession
  };
});

vi.mock('next/headers', () => ({
  cookies: cookiesMock
}));

vi.mock('next/navigation', async () => {
  const actual =
    await vi.importActual<typeof import('next/navigation')>('next/navigation');

  return {
    ...actual,
    usePathname: () => '/admin/products',
    useRouter: () => ({
      refresh: vi.fn()
    })
  };
});

describe('admin shell', () => {
  it('renders the enterprise reference shell', async () => {
    cookiesMock.mockResolvedValue({ get: () => undefined });
    requireAdminSession.mockResolvedValue({
      id: 'admin-1',
      username: 'admin'
    });

    const AdminProtectedLayout =
      (await import('@/app/admin/(protected)/layout')).default;

    const html = renderToStaticMarkup(
      await AdminProtectedLayout({ children: <div>Child</div> })
    );

    expect(html).toContain('/logo-options/fbgm_logo_uploaded_transparent.png');
    expect(html).toContain('数据分析');
    expect(html).toContain('商品管理');
    expect(html).toContain('系统设置');
    expect(html).not.toContain('轮播图');
    expect(html).not.toContain('分类管理');
    expect(html).not.toContain('href="/admin/banners"');
    expect(html).toContain('href="/admin/categories"');
    expect(html).toContain('sticky top-0 z-30 flex h-14 items-center justify-between border-b border-admin-border bg-admin-bg px-6');
    expect(html).toContain('aria-haspopup="menu"');
    expect(html).toContain('aria-label="语言"');
    expect(html).toContain('rounded-xl border border-admin-border bg-white px-3 py-2');
    expect(html).not.toContain('<select');
    expect(html).toContain('admin');
    expect(html).not.toContain('系统管理员');
    expect(html).not.toContain('admin@enterprise.ai');
    expect(html).not.toContain('管理员</span>');
    expect(html).not.toContain('Administrador');
  });

  it('offsets the main content when the desktop sidebar is fixed', async () => {
    cookiesMock.mockResolvedValue({ get: () => undefined });
    requireAdminSession.mockResolvedValue({
      id: 'admin-1',
      username: 'admin'
    });

    const AdminProtectedLayout =
      (await import('@/app/admin/(protected)/layout')).default;

    const html = renderToStaticMarkup(
      await AdminProtectedLayout({ children: <div>Child</div> })
    );

    expect(html).toContain('fixed left-0 top-0');
    expect(html).toContain('ml-60 min-h-screen');
  });

  it('does not cap the protected admin content width', async () => {
    cookiesMock.mockResolvedValue({ get: () => undefined });
    requireAdminSession.mockResolvedValue({
      id: 'admin-1',
      username: 'admin'
    });

    const AdminProtectedLayout =
      (await import('@/app/admin/(protected)/layout')).default;

    const html = renderToStaticMarkup(
      await AdminProtectedLayout({ children: <div>Child</div> })
    );

    expect(html).not.toContain('max-w-[1600px]');
    expect(html).not.toContain('mx-auto');
  });
});
