import { NextResponse } from 'next/server';

import { updateMailAutomationSetting } from '@/features/admin/subscriber-actions';

export async function PUT(request: Request) {
  const automation = await updateMailAutomationSetting(await request.json());

  return NextResponse.json({
    ok: true,
    automation
  });
}
