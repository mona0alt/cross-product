import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const adminFindUnique = vi.fn();

vi.mock('@/lib/db', () => ({
  db: {
    admin: {
      findUnique: adminFindUnique
    }
  }
}));

describe('admin login flow', () => {
  beforeEach(() => {
    adminFindUnique.mockReset();
    vi.resetModules();
    process.env.DATABASE_URL = 'postgresql://user:password@localhost:5432/cross';
    process.env.ADMIN_USERNAME = 'admin';
    process.env.ADMIN_PASSWORD = 'ChangeMe123!';
    process.env.WHATSAPP_NUMBER = '15551234567';
  });

  it('rejects invalid credentials', async () => {
    adminFindUnique.mockResolvedValue(null);

    const { POST } = await import('@/app/api/admin/login/route');
    const response = await POST(
      new Request('http://localhost/api/admin/login', {
        method: 'POST',
        body: JSON.stringify({
          username: 'admin',
          password: 'bad-password'
        }),
        headers: {
          'content-type': 'application/json'
        }
      })
    );

    expect(response.status).toBe(401);
  });

  it('sets session cookie for valid credentials', async () => {
    const { hashPassword, ADMIN_SESSION_COOKIE } = await import('@/lib/auth');
    const passwordHash = await hashPassword('ChangeMe123!');

    adminFindUnique.mockResolvedValue({
      id: 'admin-1',
      username: 'admin',
      passwordHash
    });

    const { POST } = await import('@/app/api/admin/login/route');
    const response = await POST(
      new Request('http://localhost/api/admin/login', {
        method: 'POST',
        body: JSON.stringify({
          username: 'admin',
          password: 'ChangeMe123!'
        }),
        headers: {
          'content-type': 'application/json'
        }
      })
    );

    expect(response.status).toBe(200);
    expect(response.headers.get('set-cookie')).toContain(ADMIN_SESSION_COOKIE);
  });

  it('redirects anonymous users away from protected admin routes', async () => {
    const { middleware } = await import('../../middleware');
    const response = middleware(new NextRequest('http://localhost/admin'));

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toContain('/admin/login');
  });
});
