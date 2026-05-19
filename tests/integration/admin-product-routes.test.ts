import { beforeEach, describe, expect, it, vi } from 'vitest';

const requireAdminSession = vi.fn();
const getAdminProductList = vi.fn();

vi.mock('@/lib/auth', () => ({
  requireAdminSession
}));

vi.mock('@/features/catalog/queries', () => ({
  getAdminProductList
}));

describe('admin product routes', () => {
  beforeEach(() => {
    vi.resetModules();
    requireAdminSession.mockReset();
    getAdminProductList.mockReset();
    requireAdminSession.mockResolvedValue({ id: 'admin-1', username: 'admin' });
  });

  it('returns product rows from backend search filters', async () => {
    getAdminProductList.mockResolvedValue([
      {
        id: 'product-1',
        slug: 'alpha-drone',
        productCode: 'DR-1001',
        categoryId: 'cat-drones',
        nameZh: '阿尔法无人机',
        nameEn: 'Alpha Drone',
        nameEs: 'Dron Alfa',
        namePt: 'Drone Alfa',
        introZh: '中文简介',
        introEn: 'English intro',
        introEs: 'Intro ES',
        introPt: 'Intro PT',
        detailZh: '中文详情',
        detailEn: 'English detail',
        detailEs: 'Detalle ES',
        detailPt: 'Detalhe PT',
        priceUsd: { toString: () => '899' },
        coverImageUrl: '/uploads/products/alpha.webp',
        status: 'published',
        isRecommended: true,
        sortOrder: 1,
        images: [
          {
            imageUrl: '/uploads/products/alpha-1.webp',
            sortOrder: 0
          }
        ],
        category: {
          nameZh: '无人机',
          nameEn: 'Drones',
          nameEs: 'Drones',
          namePt: 'Drones'
        }
      }
    ]);

    const { GET } = await import('@/app/api/admin/products/route');
    const response = await GET(
      new Request(
        'http://localhost/api/admin/products?search=drone&status=recommended&categoryId=cat-drones&locale=en'
      )
    );

    await expect(response.json()).resolves.toEqual({
      ok: true,
      products: [
        expect.objectContaining({
          id: 'product-1',
          productCode: 'DR-1001',
          localizedName: 'Alpha Drone',
          categoryName: 'Drones',
          priceUsd: 899,
          images: [{ imageUrl: '/uploads/products/alpha-1.webp', sortOrder: 0 }]
        })
      ]
    });
    expect(requireAdminSession).toHaveBeenCalled();
    expect(getAdminProductList).toHaveBeenCalledWith({
      search: 'drone',
      status: 'recommended',
      categoryId: 'cat-drones'
    });
  });

  it('rejects unauthenticated product searches', async () => {
    requireAdminSession.mockRejectedValue(new Error('unauthorized'));

    const { GET } = await import('@/app/api/admin/products/route');
    const response = await GET(
      new Request('http://localhost/api/admin/products?search=drone')
    );

    expect(response.status).toBe(401);
    expect(getAdminProductList).not.toHaveBeenCalled();
  });
});
