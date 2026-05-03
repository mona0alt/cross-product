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
  it('renders the upgraded admin shell structure', async () => {
    requireAdminSession.mockResolvedValue({
      id: 'admin-1',
      username: 'admin'
    });

    const AdminProtectedLayout =
      (await import('@/app/admin/(protected)/layout')).default;

    const html = renderToStaticMarkup(
      await AdminProtectedLayout({ children: <div>Child</div> })
    );

    expect(html).toContain('Demo Preview');
    expect(html).toContain('适合客户静态确认的后台原型');
    expect(html).toContain('工作台总览');
    expect(html).toContain('Cross Admin Demo');
    expect(html).toContain('商品中心');
    expect(html).toContain('AI 数据分析');
  });
});
