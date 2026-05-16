import { NextResponse } from 'next/server';

import { testCurrentDatabaseConnection } from '@/features/admin/system-settings-actions';
import { requireAdminSession } from '@/lib/auth';

export async function POST() {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  }

  const result = await testCurrentDatabaseConnection();

  return NextResponse.json(result, { status: result.ok ? 200 : 503 });
}
