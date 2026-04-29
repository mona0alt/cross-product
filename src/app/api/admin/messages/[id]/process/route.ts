import { NextResponse } from 'next/server';

import { markMessageProcessed } from '@/features/admin/banner-actions';

export async function POST(
  _request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  const { id } = await context.params;
  const message = await markMessageProcessed(id);

  return NextResponse.json({
    ok: true,
    id: message.id,
    status: message.status
  });
}
