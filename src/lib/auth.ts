import { createHmac } from 'node:crypto';

import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';

import { ADMIN_SESSION_COOKIE, ADMIN_SESSION_MAX_AGE } from '@/lib/auth-constants';
import { db } from '@/lib/db';
import { getEnv } from '@/lib/env';

type AdminIdentity = {
  id: string;
  username: string;
};

type SessionPayload = {
  adminId: string;
  username: string;
};

function getSessionSecret() {
  const env = getEnv();

  return `${env.ADMIN_PASSWORD}:${env.DATABASE_URL}`;
}

function toBase64Url(value: string) {
  return Buffer.from(value, 'utf8').toString('base64url');
}

function fromBase64Url(value: string) {
  return Buffer.from(value, 'base64url').toString('utf8');
}

function signPayload(payload: string) {
  return createHmac('sha256', getSessionSecret())
    .update(payload)
    .digest('base64url');
}

function encodeAdminSession(admin: AdminIdentity) {
  const payload = toBase64Url(
    JSON.stringify({
      adminId: admin.id,
      username: admin.username
    } satisfies SessionPayload)
  );

  return `${payload}.${signPayload(payload)}`;
}

function decodeAdminSession(value?: string | null): SessionPayload | null {
  if (!value) {
    return null;
  }

  const [payload, signature] = value.split('.');
  if (!payload || !signature || signPayload(payload) !== signature) {
    return null;
  }

  try {
    const parsed = JSON.parse(fromBase64Url(payload)) as Partial<SessionPayload>;

    if (!parsed.adminId || !parsed.username) {
      return null;
    }

    return {
      adminId: parsed.adminId,
      username: parsed.username
    };
  } catch {
    return null;
  }
}

function isSecureCookie() {
  if (process.env.COOKIE_SECURE === 'false') {
    return false;
  }

  return process.env.NODE_ENV === 'production';
}

function resolveSecureCookie(secure?: boolean) {
  if (typeof secure === 'boolean') {
    return secure;
  }

  return isSecureCookie();
}

function applySessionCookie(
  response: NextResponse,
  value: string,
  secure?: boolean
) {
  response.cookies.set(ADMIN_SESSION_COOKIE, value, {
    httpOnly: true,
    sameSite: 'lax',
    secure: resolveSecureCookie(secure),
    path: '/',
    maxAge: ADMIN_SESSION_MAX_AGE
  });

  return response;
}

export { ADMIN_SESSION_COOKIE };

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function isValidAdminPassword(
  password: string,
  passwordHash: string
) {
  return bcrypt.compare(password, passwordHash);
}

export async function createAdminSession(
  admin: AdminIdentity,
  response?: NextResponse,
  options?: {
    secure?: boolean;
  }
) {
  const sessionValue = encodeAdminSession(admin);

  if (response) {
    return applySessionCookie(response, sessionValue, options?.secure);
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, sessionValue, {
    httpOnly: true,
    sameSite: 'lax',
    secure: resolveSecureCookie(options?.secure),
    path: '/',
    maxAge: ADMIN_SESSION_MAX_AGE
  });
}

export async function clearAdminSession(
  response?: NextResponse,
  options?: {
    secure?: boolean;
  }
) {
  if (response) {
    response.cookies.set(ADMIN_SESSION_COOKIE, '', {
      httpOnly: true,
      sameSite: 'lax',
      secure: resolveSecureCookie(options?.secure),
      path: '/',
      maxAge: 0
    });

    return response;
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: resolveSecureCookie(options?.secure),
    path: '/',
    maxAge: 0
  });
}

export async function requireAdminSession() {
  const cookieStore = await cookies();
  const session = decodeAdminSession(
    cookieStore.get(ADMIN_SESSION_COOKIE)?.value
  );

  if (!session) {
    redirect('/admin/login');
  }

  const admin = await db.admin.findUnique({
    where: {
      id: session.adminId
    }
  });

  if (!admin || admin.username !== session.username) {
    redirect('/admin/login');
  }

  return admin;
}
