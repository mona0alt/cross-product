'use server';

import { revalidatePath } from 'next/cache';

import { db } from '@/lib/db';

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
  return db.category.create({
    data: {
      sortOrder: 0,
      isActive: true,
      ...input
    }
  });
}

export async function updateCategory(id: string, input: Partial<CategoryInput>) {
  return db.category.update({
    where: { id },
    data: input
  });
}

export async function deleteCategoryById(id: string) {
  return db.category.delete({
    where: { id }
  });
}

export async function disableCategoryById(id: string) {
  return updateCategory(id, { isActive: false });
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
    iconImageUrl: getNullableFormString(formData, 'iconImageUrl'),
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
  await disableCategoryById(id);

  revalidateCategoryAdminPaths();
}
