import { NextResponse } from 'next/server';

import { createAdminSubscriber } from '@/features/admin/subscriber-actions';

export async function POST(request: Request) {
  const subscriber = await createAdminSubscriber(await request.json());

  return NextResponse.json({
    ok: true,
    subscriber
  });
}
