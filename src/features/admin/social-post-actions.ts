'use server';

import { revalidatePath } from 'next/cache';

import { socialPlatforms } from '@/features/catalog/social-platforms';
import { requireAdminSession } from '@/lib/auth';
import { db } from '@/lib/db';

type SocialPostInput = {
  platform: string;
  imageUrl: string;
  targetUrl: string;
};

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

type SocialPostUpdateInput = {
  imageUrl: string;
  targetUrl: string;
};

function getTargetUrl(formData: FormData) {
  const value = getRequiredFormString(formData, 'targetUrl');

  if (/^https?:\/\//.test(value)) {
    return value;
  }

  throw new Error('INVALID_targetUrl');
}

function getSocialPostFormPayload(formData: FormData): SocialPostUpdateInput {
  return {
    imageUrl: getRequiredFormString(formData, 'imageUrl'),
    targetUrl: getTargetUrl(formData)
  };
}

function revalidateSocialPostPages() {
  revalidatePath('/');
  revalidatePath('/admin/social-posts');
}

export async function createSocialPost(input: SocialPostInput) {
  await requireAdminSession();
  const post = await db.socialPost.create({
    data: input
  });

  revalidateSocialPostPages();

  return post;
}

export async function createSocialPostFromForm(formData: FormData) {
  const payload = getSocialPostFormPayload(formData);

  return createSocialPost({ platform: socialPlatforms[0].key, ...payload });
}

export async function updateSocialPost(id: string, input: SocialPostUpdateInput) {
  await requireAdminSession();
  const post = await db.socialPost.update({
    where: { id },
    data: input
  });

  revalidateSocialPostPages();

  return post;
}

export async function updateSocialPostFromForm(id: string, formData: FormData) {
  return updateSocialPost(id, getSocialPostFormPayload(formData));
}

export async function deleteSocialPost(id: string) {
  await requireAdminSession();
  const post = await db.socialPost.delete({
    where: { id }
  });

  revalidateSocialPostPages();

  return post;
}
