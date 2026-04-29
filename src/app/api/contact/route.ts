import { NextResponse } from 'next/server';

import { contactSchema, createMessage } from '@/features/forms/contact';

export async function POST(request: Request) {
  const payload = contactSchema.parse(await request.json());
  const message = await createMessage(payload);

  return NextResponse.json({
    ok: true,
    id: message.id
  });
}
