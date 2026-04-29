import { z } from 'zod';
import { NextResponse } from 'next/server';

import { createAdminSession, isValidAdminPassword } from '@/lib/auth';
import { db } from '@/lib/db';

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1)
});

export async function POST(request: Request) {
  const payload = loginSchema.parse(await request.json());
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
    NextResponse.json({ ok: true })
  );
}
