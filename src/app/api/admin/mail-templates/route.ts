import { NextResponse } from 'next/server';

import { createMailTemplate } from '@/features/admin/subscriber-actions';

export async function POST(request: Request) {
  const template = await createMailTemplate(await request.json());

  return NextResponse.json({
    ok: true,
    template
  });
}
