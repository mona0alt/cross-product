import { NextResponse } from 'next/server';

import { deleteAdminSubscriber } from '@/features/admin/subscriber-actions';

export async function DELETE(
  _request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  const { id } = await context.params;

  await deleteAdminSubscriber(id);

  return NextResponse.json({
    ok: true,
    id
  });
}
