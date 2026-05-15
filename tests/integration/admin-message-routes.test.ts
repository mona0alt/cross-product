import { beforeEach, describe, expect, it, vi } from 'vitest';

const requireAdminSession = vi.fn();
const messageUpdate = vi.fn();
const messageDelete = vi.fn();

vi.mock('@/lib/auth', () => ({
  requireAdminSession
}));

vi.mock('@/lib/db', () => ({
  db: {
    message: {
      update: messageUpdate,
      delete: messageDelete
    }
  }
}));

describe('admin message routes', () => {
  beforeEach(() => {
    vi.resetModules();
    requireAdminSession.mockReset();
    messageUpdate.mockReset();
    messageDelete.mockReset();
    requireAdminSession.mockResolvedValue({ id: 'admin-1', username: 'admin' });
  });

  it('marks a message as read through the authenticated API route', async () => {
    messageUpdate.mockResolvedValue({
      id: 'message-1',
      status: 'processed'
    });

    const { POST } = await import('@/app/api/admin/messages/[id]/process/route');
    const response = await POST(
      new Request('http://localhost/api/admin/messages/message-1/process', {
        method: 'POST'
      }),
      {
        params: Promise.resolve({ id: 'message-1' })
      }
    );

    await expect(response.json()).resolves.toEqual({
      ok: true,
      id: 'message-1',
      status: 'processed'
    });
    expect(requireAdminSession).toHaveBeenCalled();
    expect(messageUpdate).toHaveBeenCalledWith({
      where: { id: 'message-1' },
      data: {
        status: 'processed',
        processedAt: expect.any(Date)
      }
    });
  });

  it('deletes a message through the authenticated API route', async () => {
    messageDelete.mockResolvedValue({
      id: 'message-1'
    });

    const { DELETE } = await import('@/app/api/admin/messages/[id]/route');
    const response = await DELETE(
      new Request('http://localhost/api/admin/messages/message-1', {
        method: 'DELETE'
      }),
      {
        params: Promise.resolve({ id: 'message-1' })
      }
    );

    await expect(response.json()).resolves.toEqual({
      ok: true,
      id: 'message-1'
    });
    expect(requireAdminSession).toHaveBeenCalled();
    expect(messageDelete).toHaveBeenCalledWith({
      where: { id: 'message-1' }
    });
  });

  it('rejects unauthenticated message updates', async () => {
    requireAdminSession.mockRejectedValue(new Error('unauthorized'));

    const { POST } = await import('@/app/api/admin/messages/[id]/process/route');
    const response = await POST(
      new Request('http://localhost/api/admin/messages/message-1/process', {
        method: 'POST'
      }),
      {
        params: Promise.resolve({ id: 'message-1' })
      }
    );

    expect(response.status).toBe(401);
    expect(messageUpdate).not.toHaveBeenCalled();
  });
});
