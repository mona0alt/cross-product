import { beforeEach, describe, expect, it, vi } from 'vitest';

const categoryFindMany = vi.fn();
const productFindMany = vi.fn();

vi.mock('@/lib/db', () => ({
  db: {
    category: {
      findMany: categoryFindMany
    },
    product: {
      findMany: productFindMany
    }
  }
}));

const activeRootDrone = {
  id: 'root-drone',
  parentId: null,
  slug: 'industrial-drones',
  sortOrder: 1,
  isActive: true,
  iconImageUrl: '/uploads/categories/drone.webp',
  nameZh: '工业无人机',
  nameEn: 'Industrial Drones',
  nameEs: 'Drones Industriales',
  namePt: 'Drones Industriais',
  descriptionZh: '工业',
  descriptionEn: 'Industrial',
  descriptionEs: 'Industrial',
  descriptionPt: 'Industrial'
};

const inactiveRootWindow = {
  id: 'root-window',
  parentId: null,
  slug: 'window-cleaning-robots',
  sortOrder: 2,
  isActive: false,
  iconImageUrl: null,
  nameZh: '擦窗机器人',
  nameEn: 'Window Cleaning Robots',
  nameEs: 'Robots Limpiacristales',
  namePt: 'Robôs de Limpeza de Vidros',
  descriptionZh: '擦窗',
  descriptionEn: 'Window cleaning',
  descriptionEs: 'Ventanas',
  descriptionPt: 'Janelas'
};

const activeChildWindow = {
  id: 'child-window',
  parentId: 'root-window',
  slug: 'residential-window-robots',
  sortOrder: 1,
  isActive: true,
  iconImageUrl: '/uploads/categories/window.webp',
  nameZh: '家用擦窗机器人',
  nameEn: 'Residential Window Robots',
  nameEs: 'Residencial',
  namePt: 'Residencial',
  descriptionZh: '家用',
  descriptionEn: 'Residential',
  descriptionEs: 'Residencial',
  descriptionPt: 'Residencial'
};

const activeChildSurvey = {
  id: 'child-survey',
  parentId: 'root-drone',
  slug: 'survey-drones',
  sortOrder: 1,
  isActive: true,
  iconImageUrl: '/uploads/categories/survey.webp',
  nameZh: '测绘无人机',
  nameEn: 'Survey Drones',
  nameEs: 'Drones de inspeccion',
  namePt: 'Drones de levantamento',
  descriptionZh: '测绘',
  descriptionEn: 'Survey',
  descriptionEs: 'Inspeccion',
  descriptionPt: 'Levantamento'
};

describe('storefront category queries with inactive parents', () => {
  beforeEach(() => {
    categoryFindMany.mockReset();
    productFindMany.mockReset();
  });

  it('hides an active child category whose parent is inactive instead of promoting it to a root', async () => {
    categoryFindMany.mockResolvedValue([
      inactiveRootWindow,
      activeChildWindow,
      activeRootDrone
    ]);
    productFindMany.mockResolvedValue([]);

    const { getStorefrontCategoryGroups } = await import(
      '@/features/catalog/queries'
    );
    const groups = await getStorefrontCategoryGroups('en');

    expect(groups.map((group) => group.slug)).toEqual(['industrial-drones']);
  });

  it('nests an active child category under its active parent', async () => {
    categoryFindMany.mockResolvedValue([activeRootDrone, activeChildSurvey]);
    productFindMany.mockResolvedValue([]);

    const { getStorefrontCategoryGroups } = await import(
      '@/features/catalog/queries'
    );
    const groups = await getStorefrontCategoryGroups('en');

    expect(groups).toHaveLength(1);
    expect(groups[0]).toMatchObject({
      slug: 'industrial-drones',
      children: [{ slug: 'survey-drones', name: 'Survey Drones' }]
    });
  });

  it('only queries storefront navigation products whose category and parent category are active', async () => {
    categoryFindMany.mockResolvedValue([activeRootDrone, activeChildSurvey]);
    productFindMany.mockResolvedValue([]);

    const { getStorefrontCategoryGroups } = await import(
      '@/features/catalog/queries'
    );
    await getStorefrontCategoryGroups('en');

    expect(productFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          status: 'published',
          category: {
            isActive: true,
            parent: { isActive: true }
          }
        }
      })
    );
  });

  it('only lists published products whose category and parent category are active', async () => {
    categoryFindMany.mockResolvedValue([]);
    productFindMany.mockResolvedValue([]);

    const { getProductListPayload } = await import('@/features/catalog/queries');
    await getProductListPayload({}, 'en');

    expect(productFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          status: 'published',
          category: {
            isActive: true,
            parent: { isActive: true }
          }
        }
      })
    );
  });

  it('combines the active-parent constraint with the category slug filter', async () => {
    categoryFindMany.mockResolvedValue([]);
    productFindMany.mockResolvedValue([]);

    const { getProductListPayload } = await import('@/features/catalog/queries');
    await getProductListPayload({ categorySlug: 'survey-drones' }, 'en');

    expect(productFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          status: 'published',
          category: {
            isActive: true,
            parent: { isActive: true }
          },
          OR: [
            {
              category: {
                slug: 'survey-drones'
              }
            },
            {
              category: {
                parent: {
                  slug: 'survey-drones'
                }
              }
            }
          ]
        }
      })
    );
  });
});
