import { rm, stat } from 'node:fs/promises';
import { join } from 'node:path';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const requireAdminSession = vi.fn();
const createdFiles: string[] = [];

vi.mock('@/lib/auth', () => ({
  requireAdminSession
}));

function formWithFile(file: File, scope?: string) {
  const formData = new FormData();
  formData.set('file', file);
  if (scope) {
    formData.set('scope', scope);
  }
  return formData;
}

describe('admin upload route', () => {
  beforeEach(() => {
    vi.resetModules();
    requireAdminSession.mockReset();
  });

  afterEach(async () => {
    await Promise.all(
      createdFiles.splice(0).map((filePath) =>
        rm(filePath, { force: true }).catch(() => undefined)
      )
    );
  });

  it('rejects unauthenticated uploads', async () => {
    requireAdminSession.mockRejectedValue(new Error('unauthorized'));

    const { POST } = await import('@/app/api/admin/uploads/product-images/route');
    const response = await POST(
      new Request('http://localhost/api/admin/uploads/product-images', {
        method: 'POST',
        body: formWithFile(new File(['image'], 'image.png', { type: 'image/png' }))
      })
    );

    expect(response.status).toBe(401);
  });

  it('rejects unsupported file types', async () => {
    requireAdminSession.mockResolvedValue({ id: 'admin-1', username: 'admin' });

    const { POST } = await import('@/app/api/admin/uploads/product-images/route');
    const response = await POST(
      new Request('http://localhost/api/admin/uploads/product-images', {
        method: 'POST',
        body: formWithFile(new File(['plain text'], 'notes.txt', { type: 'text/plain' }))
      })
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: 'UNSUPPORTED_FILE_TYPE'
    });
  });

  it('stores a valid image on local disk and returns a public uploads URL', async () => {
    requireAdminSession.mockResolvedValue({ id: 'admin-1', username: 'admin' });

    const { POST } = await import('@/app/api/admin/uploads/product-images/route');
    const response = await POST(
      new Request('http://localhost/api/admin/uploads/product-images', {
        method: 'POST',
        body: formWithFile(
          new File([new Uint8Array([137, 80, 78, 71])], 'image.png', {
            type: 'image/png'
          }),
          'product'
        )
      })
    );

    expect(response.status).toBe(200);
    const payload = (await response.json()) as { url: string };
    expect(payload.url).toMatch(/^\/uploads\/products\/\d{4}\/\d{2}\/.+\.png$/);

    const filePath = join(process.cwd(), 'public', payload.url);
    createdFiles.push(filePath);
    await expect(stat(filePath)).resolves.toMatchObject({ isFile: expect.any(Function) });
  });

  it('stores category images under the category upload segment', async () => {
    requireAdminSession.mockResolvedValue({ id: 'admin-1', username: 'admin' });

    const { POST } = await import('@/app/api/admin/uploads/product-images/route');
    const response = await POST(
      new Request('http://localhost/api/admin/uploads/product-images', {
        method: 'POST',
        body: formWithFile(
          new File([new Uint8Array([137, 80, 78, 71])], 'category.png', {
            type: 'image/png'
          }),
          'category'
        )
      })
    );

    expect(response.status).toBe(200);
    const payload = (await response.json()) as { url: string };
    expect(payload.url).toMatch(/^\/uploads\/categories\/\d{4}\/\d{2}\/.+\.png$/);

    const filePath = join(process.cwd(), 'public', payload.url);
    createdFiles.push(filePath);
    await expect(stat(filePath)).resolves.toMatchObject({ isFile: expect.any(Function) });
  });
});
