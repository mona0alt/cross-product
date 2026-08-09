import { beforeEach, describe, expect, it, vi } from 'vitest';

const requireAdminSession = vi.fn();
const revalidatePath = vi.fn();
const socialPostCreate = vi.fn();
const socialPostUpdate = vi.fn();
const socialPostDelete = vi.fn();

vi.mock('@/lib/auth', () => ({
  requireAdminSession
}));

vi.mock('next/cache', () => ({
  revalidatePath
}));

vi.mock('@/lib/db', () => ({
  db: {
    socialPost: {
      create: socialPostCreate,
      update: socialPostUpdate,
      delete: socialPostDelete
    }
  }
}));

function buildFormData(entries: Record<string, string>) {
  const formData = new FormData();

  for (const [key, value] of Object.entries(entries)) {
    formData.set(key, value);
  }

  return formData;
}

const validForm = {
  imageUrl: '/uploads/social/2026/08/cover.jpg',
  targetUrl: 'https://www.instagram.com/fbgm_decomaterial'
};

describe('admin social post actions', () => {
  beforeEach(() => {
    requireAdminSession.mockReset();
    revalidatePath.mockReset();
    socialPostCreate.mockReset();
    socialPostUpdate.mockReset();
    socialPostDelete.mockReset();
    requireAdminSession.mockResolvedValue({ id: 'admin-1', username: 'admin' });
  });

  it('creates a social post from form data and revalidates pages', async () => {
    socialPostCreate.mockResolvedValue({ id: 'post-1', ...validForm });

    const { createSocialPostFromForm } = await import(
      '@/features/admin/social-post-actions'
    );
    await createSocialPostFromForm(buildFormData(validForm));

    expect(requireAdminSession).toHaveBeenCalled();
    expect(socialPostCreate).toHaveBeenCalledWith({
      data: { platform: 'facebook', ...validForm }
    });
    expect(revalidatePath).toHaveBeenCalledWith('/');
    expect(revalidatePath).toHaveBeenCalledWith('/admin/social-posts');
  });

  it('rejects a target url without http(s) protocol', async () => {
    const { createSocialPostFromForm } = await import(
      '@/features/admin/social-post-actions'
    );

    await expect(
      createSocialPostFromForm(
        buildFormData({ ...validForm, targetUrl: 'javascript:alert(1)' })
      )
    ).rejects.toThrow('INVALID_targetUrl');
    expect(socialPostCreate).not.toHaveBeenCalled();
  });

  it('requires image and target url', async () => {
    const { createSocialPostFromForm } = await import(
      '@/features/admin/social-post-actions'
    );

    await expect(
      createSocialPostFromForm(buildFormData({ ...validForm, imageUrl: ' ' }))
    ).rejects.toThrow('MISSING_imageUrl');
    await expect(
      createSocialPostFromForm(buildFormData({ ...validForm, targetUrl: '' }))
    ).rejects.toThrow('MISSING_targetUrl');
    expect(socialPostCreate).not.toHaveBeenCalled();
  });

  it('updates and deletes social posts with admin session checks', async () => {
    socialPostUpdate.mockResolvedValue({ id: 'post-1', ...validForm });
    socialPostDelete.mockResolvedValue({ id: 'post-1' });

    const { updateSocialPostFromForm, deleteSocialPost } = await import(
      '@/features/admin/social-post-actions'
    );

    await updateSocialPostFromForm('post-1', buildFormData(validForm));
    expect(socialPostUpdate).toHaveBeenCalledWith({
      where: { id: 'post-1' },
      data: validForm
    });

    await deleteSocialPost('post-1');
    expect(socialPostDelete).toHaveBeenCalledWith({ where: { id: 'post-1' } });
    expect(requireAdminSession).toHaveBeenCalledTimes(2);
    expect(revalidatePath).toHaveBeenCalledWith('/admin/social-posts');
  });
});
