import { z } from 'zod';
import { NextResponse } from 'next/server';

import { createAdminSession, isValidAdminPassword } from '@/lib/auth';
import { db } from '@/lib/db';

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1)
});

export async function POST(request: Request) {
  try {
    const payload = loginSchema.parse(await request.json());
    const isHttpsRequest = new URL(request.url).protocol === 'https:';
    const admin = await db.admin.findUnique({
      where: {
        username: payload.username
      }
    });

    if (!admin) {
      return NextResponse.json(
        { error: 'INVALID_CREDENTIALS' },
        { status: 401 }
      );
    }

    const isValid = await isValidAdminPassword(
      payload.password,
      admin.passwordHash
    );

    if (!isValid) {
      return NextResponse.json(
        { error: 'INVALID_CREDENTIALS' },
        { status: 401 }
      );
    }

    return createAdminSession(
      {
        id: admin.id,
        username: admin.username
      },
      NextResponse.json({ ok: true }),
      {
        secure: isHttpsRequest
      }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'INVALID_REQUEST' },
        { status: 400 }
      );
    }

    // eslint-disable-next-line no-console
    console.error('Login API error:', error);

    return NextResponse.json(
      { error: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
