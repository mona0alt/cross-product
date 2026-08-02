import { beforeEach, describe, expect, it, vi } from 'vitest';

const categoryFindUnique = vi.fn();
const categoryCreate = vi.fn();
const categoryUpdate = vi.fn();
const categoryCount = vi.fn();
const productCount = vi.fn();
const revalidatePath = vi.fn();

vi.mock('@/lib/db', () => ({
  db: {
    category: {
      findUnique: categoryFindUnique,
      create: categoryCreate,
      update: categoryUpdate,
      count: categoryCount
    },
    product: {
      count: productCount
    }
  }
}));

vi.mock('next/cache', () => ({
  revalidatePath
}));

function createValidInput(parentId: string | null = null) {
  return {
    parentId,
    slug: 'third-level',
    nameZh: '三级',
    nameEn: 'Third',
    nameEs: 'Third',
    namePt: 'Third'
  };
}

describe('admin category actions hierarchy rules', () => {
  beforeEach(() => {
    categoryFindUnique.mockReset();
    categoryCreate.mockReset();
    categoryUpdate.mockReset();
    categoryCount.mockReset();
    productCount.mockReset();
    revalidatePath.mockReset();
  });

  it('rejects creating a third-level category (parent must be a root)', async () => {
    // The proposed parent is itself a leaf.
    categoryFindUnique.mockResolvedValue({ parentId: 'root-1' });

    const { createCategory } = await import('@/features/admin/category-actions');

    await expect(createCategory(createValidInput('leaf-1'))).rejects.toThrow(
      'CATEGORY_PARENT_MUST_BE_ROOT'
    );
    expect(categoryCreate).not.toHaveBeenCalled();
  });

  it('creates a root category when parentId is null', async () => {
    categoryCreate.mockResolvedValue({ id: 'cat-new', slug: 'third-level' });

    const { createCategory } = await import('@/features/admin/category-actions');
    const result = await createCategory({
      ...createValidInput(null),
      iconImageUrl: '/uploads/category/root.png'
    });

    expect(categoryCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({ parentId: null, slug: 'third-level' })
    });
    expect(result.id).toBe('cat-new');
    expect(categoryFindUnique).not.toHaveBeenCalled();
  });

  it('creates a leaf category under a valid root parent', async () => {
    categoryFindUnique.mockResolvedValue({ parentId: null });
    categoryCreate.mockResolvedValue({ id: 'cat-leaf', slug: 'third-level' });

    const { createCategory } = await import('@/features/admin/category-actions');
    const result = await createCategory(createValidInput('root-1'));

    expect(categoryFindUnique).toHaveBeenCalledWith({
      where: { id: 'root-1' },
      select: { parentId: true }
    });
    expect(categoryCreate).toHaveBeenCalled();
    expect(result.id).toBe('cat-leaf');
  });

  it('rejects turning a root with children into a leaf', async () => {
    // New parent is a valid root, but the category itself has children.
    categoryFindUnique.mockResolvedValue({ parentId: null });
    categoryCount.mockResolvedValue(1);

    const { updateCategory } = await import('@/features/admin/category-actions');

    await expect(updateCategory('root-1', { parentId: 'other-root' })).rejects.toThrow(
      'CATEGORY_HAS_CHILDREN'
    );
    expect(categoryUpdate).not.toHaveBeenCalled();
  });

  it('rejects turning a leaf with products into a root', async () => {
    productCount.mockResolvedValue(3);

    const { updateCategory } = await import('@/features/admin/category-actions');

    await expect(updateCategory('leaf-1', { parentId: null })).rejects.toThrow(
      'CATEGORY_HAS_PRODUCTS'
    );
    expect(categoryUpdate).not.toHaveBeenCalled();
  });

  it('rejects setting a category as its own parent', async () => {
    const { updateCategory } = await import('@/features/admin/category-actions');

    await expect(updateCategory('cat-1', { parentId: 'cat-1' })).rejects.toThrow(
      'CATEGORY_CANNOT_BE_OWN_PARENT'
    );
    expect(categoryFindUnique).not.toHaveBeenCalled();
    expect(categoryUpdate).not.toHaveBeenCalled();
  });

  it('updates a category when moving it under a valid root parent', async () => {
    categoryFindUnique.mockResolvedValue({ parentId: null });
    categoryCount.mockResolvedValue(0);
    categoryUpdate.mockResolvedValue({ id: 'leaf-1', parentId: 'root-1' });

    const { updateCategory } = await import('@/features/admin/category-actions');
    const result = await updateCategory('leaf-1', { parentId: 'root-1' });

    expect(categoryUpdate).toHaveBeenCalledWith({
      where: { id: 'leaf-1' },
      data: { parentId: 'root-1' }
    });
    expect(result.parentId).toBe('root-1');
  });

  it('updates a category without hierarchy checks when parentId is untouched', async () => {
    categoryUpdate.mockResolvedValue({ id: 'cat-1', isActive: false });

    const { updateCategory } = await import('@/features/admin/category-actions');
    await updateCategory('cat-1', { isActive: false });

    expect(categoryFindUnique).not.toHaveBeenCalled();
    expect(categoryCount).not.toHaveBeenCalled();
    expect(productCount).not.toHaveBeenCalled();
    expect(categoryUpdate).toHaveBeenCalledWith({
      where: { id: 'cat-1' },
      data: { isActive: false }
    });
  });

  it('rejects creating a root category without an image', async () => {
    const { createCategory } = await import('@/features/admin/category-actions');

    await expect(createCategory(createValidInput(null))).rejects.toThrow(
      'CATEGORY_IMAGE_REQUIRED'
    );
    expect(categoryCreate).not.toHaveBeenCalled();
  });

  it('creates a root category with an image', async () => {
    categoryCreate.mockResolvedValue({ id: 'cat-new' });

    const { createCategory } = await import('@/features/admin/category-actions');
    await createCategory({
      ...createValidInput(null),
      iconImageUrl: '/uploads/category/robots.png'
    });

    expect(categoryCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({
        parentId: null,
        iconImageUrl: '/uploads/category/robots.png'
      })
    });
  });

  it('still allows creating a leaf category without an image', async () => {
    categoryFindUnique.mockResolvedValue({ parentId: null });
    categoryCreate.mockResolvedValue({ id: 'cat-leaf' });

    const { createCategory } = await import('@/features/admin/category-actions');
    await createCategory(createValidInput('root-1'));

    expect(categoryCreate).toHaveBeenCalled();
  });

  it('rejects clearing the image on a root category update', async () => {
    const { updateCategory } = await import('@/features/admin/category-actions');

    await expect(
      updateCategory('root-1', { parentId: null, iconImageUrl: null })
    ).rejects.toThrow('CATEGORY_IMAGE_REQUIRED');
    expect(categoryUpdate).not.toHaveBeenCalled();
  });

  it('updates a root category when an image is provided', async () => {
    categoryUpdate.mockResolvedValue({ id: 'root-1' });

    const { updateCategory } = await import('@/features/admin/category-actions');
    await updateCategory('root-1', {
      parentId: null,
      iconImageUrl: '/uploads/category/new.png'
    });

    expect(categoryUpdate).toHaveBeenCalled();
  });
});
