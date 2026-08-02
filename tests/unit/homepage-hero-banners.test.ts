import { describe, expect, it, vi } from 'vitest';

// page.tsx 的模块依赖链会引入 @/lib/db(PrismaClient),这里 mock 掉避免副作用
vi.mock('@/lib/db', () => ({
  db: {}
}));

import { getHomepageHeroBanners } from '@/app/[locale]/page';
import type { HomepagePayload } from '@/features/catalog/types';

function buildPayload(overrides: Partial<HomepagePayload> = {}): HomepagePayload {
  return {
    banners: [
      {
        id: 'banner-1',
        imageUrl: '/uploads/banner/fallback.jpg',
        targetType: 'url',
        targetId: null,
        targetUrl: 'https://example.com',
        sortOrder: 1
      }
    ],
    rootCategories: [
      {
        id: 'cat-root-1',
        slug: 'robots',
        iconImageUrl: '/uploads/category/robots.png',
        name: 'Robots',
        description: 'Robot group'
      },
      {
        id: 'cat-root-2',
        slug: 'drones',
        iconImageUrl: null,
        name: 'Drones',
        description: null
      }
    ],
    featuredCategories: [
      {
        id: 'cat-leaf-1',
        slug: 'bipedal',
        iconImageUrl: '/uploads/category/bipedal.png',
        name: 'Bipedal',
        description: null
      }
    ],
    recommendedProducts: [],
    ...overrides
  };
}

describe('getHomepageHeroBanners', () => {
  it('builds hero banners from root categories with images', () => {
    const banners = getHomepageHeroBanners(buildPayload(), 'en');

    expect(banners).toHaveLength(1);
    expect(banners[0]).toMatchObject({
      id: 'category-cat-root-1',
      imageUrl: '/uploads/category/robots.png',
      targetType: 'category',
      targetUrl: '/en/categories/robots',
      targetCategorySlug: 'robots',
      targetCategoryIsLeaf: false,
      title: 'Robots',
      description: 'Robot group'
    });
  });

  it('falls back to banner table entries when no root category has an image', () => {
    const payload = buildPayload({
      rootCategories: [
        {
          id: 'cat-root-2',
          slug: 'drones',
          iconImageUrl: null,
          name: 'Drones',
          description: null
        }
      ]
    });

    const banners = getHomepageHeroBanners(payload, 'en');

    expect(banners).toEqual(payload.banners);
  });
});
