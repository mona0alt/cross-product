import { NextResponse } from 'next/server';

import {
  createMailCampaign,
  deleteMailCampaigns
} from '@/features/admin/subscriber-actions';

export async function POST(request: Request) {
  const campaign = await createMailCampaign(await request.json());

  return NextResponse.json({
    ok: true,
    campaign
  });
}

export async function DELETE(request: Request) {
  const deletedCount = await deleteMailCampaigns(await request.json());

  return NextResponse.json({
    ok: true,
    deletedCount
  });
}
