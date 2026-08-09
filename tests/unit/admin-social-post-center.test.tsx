import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn() })
}));

vi.mock('@/features/admin/social-post-actions', () => ({
  createSocialPostFromForm: vi.fn(),
  updateSocialPostFromForm: vi.fn(),
  deleteSocialPost: vi.fn()
}));

import { SocialPostCenter } from '@/components/admin/social-post-center';

const posts = [
  {
    id: 'post-1',
    platform: 'instagram',
    imageUrl: '/uploads/social/2026/08/cover.jpg',
    targetUrl: 'https://www.instagram.com/fbgm_decomaterial'
  }
];

describe('SocialPostCenter', () => {
  it('renders the workbench header with title, count badge and create button', () => {
    const html = renderToStaticMarkup(<SocialPostCenter posts={posts} />);

    expect(html).toContain('社媒卡片');
    expect(html).toContain('新建卡片');
    expect(html).toContain('>1</span>');
  });

  it('renders a read-only row per post with cover, url, edit and delete buttons', () => {
    const html = renderToStaticMarkup(<SocialPostCenter posts={posts} />);

    expect(html).toContain('https://www.instagram.com/fbgm_decomaterial');
    expect(html).toContain('/uploads/social/2026/08/cover.jpg');
    expect(html).toContain('aria-label="编辑"');
    expect(html).toContain('aria-label="删除"');
  });

  it('does not render inline editing inputs or the drawer by default', () => {
    const html = renderToStaticMarkup(<SocialPostCenter posts={posts} />);

    expect(html).not.toContain('role="dialog"');
    expect(html).not.toContain('name="targetUrl"');
  });

  it('renders an empty state when there are no posts', () => {
    const html = renderToStaticMarkup(<SocialPostCenter posts={[]} />);

    expect(html).toContain('还没有社媒卡片');
  });
});
