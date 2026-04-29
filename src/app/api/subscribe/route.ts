import { NextResponse } from 'next/server';

import {
  createSubscriber,
  subscribeSchema
} from '@/features/forms/subscribe';

export async function POST(request: Request) {
  const payload = subscribeSchema.parse(await request.json());
  const subscriber = await createSubscriber(payload);

  return NextResponse.json({
    ok: true,
    id: subscriber.id
  });
}
