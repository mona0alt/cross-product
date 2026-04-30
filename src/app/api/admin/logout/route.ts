import { NextResponse } from 'next/server';

import { clearAdminSession } from '@/lib/auth';

export async function POST(request: Request) {
  const isHttpsRequest = new URL(request.url).protocol === 'https:';

  return clearAdminSession(
    NextResponse.json({ ok: true }),
    {
      secure: isHttpsRequest
    }
  );
}
