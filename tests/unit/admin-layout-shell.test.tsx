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

describe('admin shell', () => {
  it('renders the left navigation labels', async () => {
    requireAdminSession.mockResolvedValue({
      id: 'admin-1',
      username: 'admin'
    });

    const AdminProtectedLayout =
      (await import('@/app/admin/(protected)/layout')).default;

    const html = renderToStaticMarkup(
      await AdminProtectedLayout({ children: <div>Child</div> })
    );

    expect(html).toContain('工作台');
    expect(html).toContain('商品中心');
    expect(html).toContain('AI 数据分析');
  });
});
