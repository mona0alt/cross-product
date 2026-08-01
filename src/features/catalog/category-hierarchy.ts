import { db } from '@/lib/db';

export type CategoryLevel = 'root' | 'leaf';

type CategoryWithParent = { parentId: string | null };

export function isRootCategory(category: CategoryWithParent): boolean {
  return category.parentId === null;
}

export function isLeafCategory(category: CategoryWithParent): boolean {
  return category.parentId !== null;
}

export async function getCategoryLevel(categoryId: string): Promise<CategoryLevel | null> {
  const category = await db.category.findUnique({
    where: { id: categoryId },
    select: { parentId: true }
  });

  if (!category) {
    return null;
  }

  return isRootCategory(category) ? 'root' : 'leaf';
}

export async function validateCategoryParent(
  parentId: string | null | undefined,
  excludeCategoryId?: string
): Promise<void> {
  if (!parentId) {
    return;
  }

  if (excludeCategoryId && parentId === excludeCategoryId) {
    throw new Error('CATEGORY_CANNOT_BE_OWN_PARENT');
  }

  const parent = await db.category.findUnique({
    where: { id: parentId },
    select: { parentId: true }
  });

  if (!parent) {
    throw new Error('PARENT_CATEGORY_NOT_FOUND');
  }

  if (!isRootCategory(parent)) {
    throw new Error('CATEGORY_PARENT_MUST_BE_ROOT');
  }
}

export async function requireLeafCategory(categoryId: string): Promise<void> {
  const level = await getCategoryLevel(categoryId);

  if (level !== 'leaf') {
    throw new Error('PRODUCT_CATEGORY_MUST_BE_LEAF');
  }
}

export async function requireCategoryHasNoChildren(categoryId: string): Promise<void> {
  const childrenCount = await db.category.count({
    where: { parentId: categoryId }
  });

  if (childrenCount > 0) {
    throw new Error('CATEGORY_HAS_CHILDREN');
  }
}

export async function requireCategoryHasNoProducts(categoryId: string): Promise<void> {
  const productsCount = await db.product.count({
    where: { categoryId }
  });

  if (productsCount > 0) {
    throw new Error('CATEGORY_HAS_PRODUCTS');
  }
}
