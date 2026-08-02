'use server';

import { revalidatePath } from 'next/cache';

import { db } from '@/lib/db';
import { requireLocalImagePath } from '@/features/catalog/local-image-paths';
import {
  validateCategoryParent,
  requireCategoryHasNoChildren,
  requireCategoryHasNoProducts
} from '@/features/catalog/category-hierarchy';

type CategoryInput = {
  parentId?: string | null;
  slug: string;
  sortOrder?: number;
  iconImageUrl?: string | null;
  isActive?: boolean;
  nameZh: string;
  nameEn: string;
  nameEs: string;
  namePt: string;
  descriptionZh?: string | null;
  descriptionEn?: string | null;
  descriptionEs?: string | null;
  descriptionPt?: string | null;
};

export async function createCategory(input: CategoryInput) {
  await validateCategoryParent(input.parentId);

  return db.category.create({
    data: {
      sortOrder: 0,
      isActive: true,
      ...input,
      iconImageUrl: input.iconImageUrl
        ? requireLocalImagePath(input.iconImageUrl, 'iconImageUrl')
        : input.iconImageUrl
    }
  });
}

export async function updateCategory(id: string, input: Partial<CategoryInput>) {
  if (input.parentId !== undefined) {
    await validateCategoryParent(input.parentId, id);

    if (input.parentId) {
      await requireCategoryHasNoChildren(id);
    } else {
      await requireCategoryHasNoProducts(id);
    }
  }

  return db.category.update({
    where: { id },
    data:
      input.iconImageUrl === undefined || input.iconImageUrl === null
        ? input
        : {
            ...input,
            iconImageUrl: requireLocalImagePath(input.iconImageUrl, 'iconImageUrl')
          }
  });
}

export async function deleteCategoryById(id: string) {
  await requireCategoryHasNoChildren(id);
  await requireCategoryHasNoProducts(id);

  return db.category.delete({
    where: { id }
  });
}

function revalidateCategoryAdminPaths() {
  revalidatePath('/admin/products');
  revalidatePath('/admin/categories');
}

function getFormString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === 'string' ? value.trim() : '';
}

function getRequiredFormString(formData: FormData, key: string) {
  const value = getFormString(formData, key);

  if (!value) {
    throw new Error(`MISSING_${key}`);
  }

  return value;
}

function getNullableFormString(formData: FormData, key: string) {
  const value = getFormString(formData, key);

  return value || null;
}

function getNullableLocalImagePath(formData: FormData, key: string) {
  const value = getNullableFormString(formData, key);

  if (!value) {
    return null;
  }

  return requireLocalImagePath(value, key);
}

function getFormNumber(formData: FormData, key: string, fallback = 0) {
  const value = getFormString(formData, key);
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : fallback;
}

function getCategoryFormPayload(formData: FormData): CategoryInput {
  return {
    parentId: getNullableFormString(formData, 'parentId'),
    slug: getRequiredFormString(formData, 'slug'),
    sortOrder: getFormNumber(formData, 'sortOrder'),
    iconImageUrl: getNullableLocalImagePath(formData, 'iconImageUrl'),
    isActive: formData.get('isActive') === 'on',
    nameZh: getRequiredFormString(formData, 'nameZh'),
    nameEn: getRequiredFormString(formData, 'nameEn'),
    nameEs: getRequiredFormString(formData, 'nameEs'),
    namePt: getRequiredFormString(formData, 'namePt'),
    descriptionZh: getNullableFormString(formData, 'descriptionZh'),
    descriptionEn: getNullableFormString(formData, 'descriptionEn'),
    descriptionEs: getNullableFormString(formData, 'descriptionEs'),
    descriptionPt: getNullableFormString(formData, 'descriptionPt')
  };
}

export async function createCategoryFromForm(formData: FormData) {
  const category = await createCategory(getCategoryFormPayload(formData));

  revalidateCategoryAdminPaths();

  return category;
}

export async function updateCategoryFromForm(id: string, formData: FormData) {
  const category = await updateCategory(id, getCategoryFormPayload(formData));

  revalidateCategoryAdminPaths();

  return category;
}

export async function createCategoryFormAction(formData: FormData) {
  await createCategoryFromForm(formData);
}

export async function updateCategoryFormAction(id: string, formData: FormData) {
  await updateCategoryFromForm(id, formData);
}

export async function deleteCategoryFormAction(id: string) {
  await deleteCategoryById(id);

  revalidateCategoryAdminPaths();
}
