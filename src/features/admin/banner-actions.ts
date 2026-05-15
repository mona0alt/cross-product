'use server';

import { markMessageRead } from '@/features/admin/message-actions';
import { db } from '@/lib/db';

type BannerInput = {
  imageUrl: string;
  targetType: 'category' | 'product' | 'url';
  targetId?: string | null;
  targetUrl?: string | null;
  sortOrder?: number;
  isActive?: boolean;
};

type BannerTargetType = 'category' | 'product' | 'url';

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

function getTargetType(formData: FormData): BannerTargetType {
  const value = getFormString(formData, 'targetType');

  if (value === 'category' || value === 'product' || value === 'url') {
    return value;
  }

  return 'url';
}

function getSortOrder(formData: FormData) {
  const parsed = Number(getFormString(formData, 'sortOrder'));

  return Number.isFinite(parsed) ? parsed : 0;
}

function emptyToNull(value: string) {
  return value ? value : null;
}

function getBannerFormPayload(formData: FormData): BannerInput {
  return {
    imageUrl: getRequiredFormString(formData, 'imageUrl'),
    targetType: getTargetType(formData),
    targetId: emptyToNull(getFormString(formData, 'targetId')),
    targetUrl: emptyToNull(getFormString(formData, 'targetUrl')),
    sortOrder: getSortOrder(formData),
    isActive: formData.get('isActive') === 'on'
  };
}

export async function createBanner(input: BannerInput) {
  return db.banner.create({
    data: {
      sortOrder: 0,
      isActive: true,
      ...input
    }
  });
}

export async function createBannerFromForm(formData: FormData) {
  return createBanner(getBannerFormPayload(formData));
}

export async function updateBanner(id: string, input: Partial<BannerInput>) {
  return db.banner.update({
    where: { id },
    data: input
  });
}

export async function updateBannerFromForm(id: string, formData: FormData) {
  return updateBanner(id, getBannerFormPayload(formData));
}

export async function toggleBanner(id: string, isActive: boolean) {
  return db.banner.update({
    where: { id },
    data: { isActive }
  });
}

export async function markMessageProcessed(id: string) {
  return markMessageRead(id);
}
