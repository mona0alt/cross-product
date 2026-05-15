import { NextResponse } from 'next/server';

import {
  deleteMailTemplate,
  updateMailTemplate
} from '@/features/admin/subscriber-actions';

export async function PATCH(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  const { id } = await context.params;
  const template = await updateMailTemplate(id, await request.json());

  return NextResponse.json({
    ok: true,
    template
  });
}

export async function DELETE(
  _request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  const { id } = await context.params;

  await deleteMailTemplate(id);

  return NextResponse.json({
    ok: true,
    id
  });
}
