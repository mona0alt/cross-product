import { NextResponse } from 'next/server';

import { deleteAdminMessage } from '@/features/admin/message-actions';
import { requireAdminSession } from '@/lib/auth';

export async function DELETE(
  _request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  }

  const { id } = await context.params;
  const message = await deleteAdminMessage(id);

  return NextResponse.json({
    ok: true,
    id: message.id
  });
}
