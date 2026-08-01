import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  isRootCategory,
  isLeafCategory,
  getCategoryLevel,
  validateCategoryParent,
  requireLeafCategory,
  requireCategoryHasNoProducts
} from '@/features/catalog/category-hierarchy';
import { db } from '@/lib/db';

vi.mock('@/lib/db', () => ({
  db: {
    category: {
      findUnique: vi.fn(),
      count: vi.fn()
    },
    product: {
      count: vi.fn()
    }
  }
}));

describe('category-hierarchy', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('detects root and leaf categories', () => {
    expect(isRootCategory({ parentId: null })).toBe(true);
    expect(isLeafCategory({ parentId: 'parent-1' })).toBe(true);
  });

  it('returns category level from db', async () => {
    vi.mocked(db.category.findUnique).mockResolvedValueOnce({ parentId: 'parent-1' } as never);
    const level = await getCategoryLevel('leaf-1');
    expect(level).toBe('leaf');
  });

  it('rejects parent that is itself a leaf', async () => {
    vi.mocked(db.category.findUnique).mockResolvedValueOnce({ parentId: 'root-1' } as never);
    await expect(validateCategoryParent('invalid-parent')).rejects.toThrow(
      'CATEGORY_PARENT_MUST_BE_ROOT'
    );
  });

  it('allows null parent (root)', async () => {
    await expect(validateCategoryParent(null)).resolves.toBeUndefined();
  });

  it('requires leaf category for products', async () => {
    vi.mocked(db.category.findUnique).mockResolvedValueOnce({ parentId: null } as never);
    await expect(requireLeafCategory('root-1')).rejects.toThrow('PRODUCT_CATEGORY_MUST_BE_LEAF');
  });

  it('rejects category with products when moving to root', async () => {
    vi.mocked(db.product.count).mockResolvedValueOnce(3 as never);
    await expect(requireCategoryHasNoProducts('leaf-1')).rejects.toThrow('CATEGORY_HAS_PRODUCTS');
  });
});
