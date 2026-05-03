import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

const requireAdminSession = vi.fn();

vi.mock('@/lib/auth', async () => {
  const actual = await vi.importActual<typeof import('@/lib/auth')>('@/lib/auth');

  return {
    ...actual,
    requireAdminSession
  };
});

vi.mock('next/navigation', async () => {
  const actual =
    await vi.importActual<typeof import('next/navigation')>('next/navigation');

  return {
    ...actual,
    usePathname: () => '/admin/products'
  };
});

describe('admin shell', () => {
  it('renders the enterprise reference shell', async () => {
    requireAdminSession.mockResolvedValue({
      id: 'admin-1',
      username: 'admin'
    });

    const AdminProtectedLayout =
      (await import('@/app/admin/(protected)/layout')).default;

    const html = renderToStaticMarkup(
      await AdminProtectedLayout({ children: <div>Child</div> })
    );

    expect(html).toContain('管理后台');
    expect(html).toContain('企业级产品套件');
    expect(html).toContain('数据分析');
    expect(html).toContain('系统设置');
    expect(html).toContain('核心管理系统');
    expect(html).toContain('运行爬虫');
  });
});
