import { beforeEach, describe, expect, it, vi } from 'vitest';

const productCreate = vi.fn();
const productUpdate = vi.fn();
const productFindUnique = vi.fn();
const categoryFindUnique = vi.fn();
const categoryCreate = vi.fn();
const categoryUpdate = vi.fn();
const bannerCreate = vi.fn();
const bannerUpdate = vi.fn();
const messageUpdate = vi.fn();

vi.mock('@/lib/db', () => ({
  db: {
    product: {
      create: productCreate,
      update: productUpdate,
      findUnique: productFindUnique
    },
    category: {
      findUnique: categoryFindUnique,
      create: categoryCreate,
      update: categoryUpdate
    },
    banner: {
      create: bannerCreate,
      update: bannerUpdate
    },
    message: {
      update: messageUpdate
    }
  }
}));

describe('admin actions', () => {
  beforeEach(() => {
    productCreate.mockReset();
    productUpdate.mockReset();
    productFindUnique.mockReset();
    categoryFindUnique.mockReset();
    categoryCreate.mockReset();
    categoryUpdate.mockReset();
    bannerCreate.mockReset();
    bannerUpdate.mockReset();
    messageUpdate.mockReset();
  });

  it('creates product drafts with draft status', async () => {
    productCreate.mockResolvedValue({
      id: 'product-1',
      status: 'draft'
    });

    const { createProductDraft } = await import('@/features/admin/product-actions');
    const result = await createProductDraft({
      categoryId: 'cat-1',
      productCode: 'P-3001',
      slug: 'new-product',
      priceUsd: 199,
      coverImageUrl: '/cover.jpg'
    });

    expect(productCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: 'draft'
        })
      })
    );
    expect(result.status).toBe('draft');
  });

  it('blocks publishing when required fields are incomplete', async () => {
    productFindUnique.mockResolvedValue({
      id: 'product-1',
      categoryId: 'cat-1',
      productCode: 'P-3001',
      priceUsd: 199,
      coverImageUrl: '/cover.jpg',
      nameZh: '中文',
      nameEn: 'English',
      nameEs: 'Espanol',
      namePt: 'Portugues',
      introZh: 'ok',
      introEn: 'ok',
      introEs: 'ok',
      introPt: 'ok',
      detailZh: 'ok',
      detailEn: 'ok',
      detailEs: '',
      detailPt: 'ok'
    });
    categoryFindUnique.mockResolvedValue({ id: 'cat-1' });

    const { publishProduct } = await import('@/features/admin/product-actions');

    await expect(publishProduct('product-1')).rejects.toMatchObject({
      blockers: ['detailEs']
    });
  });

  it('marks messages as processed', async () => {
    messageUpdate.mockResolvedValue({
      id: 'message-1',
      status: 'processed'
    });

    const { markMessageProcessed } = await import('@/features/admin/banner-actions');
    const result = await markMessageProcessed('message-1');

    expect(messageUpdate).toHaveBeenCalled();
    expect(result.status).toBe('processed');
  });
});
