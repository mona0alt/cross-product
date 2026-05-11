import { NextResponse } from 'next/server';

import {
  normalizeAdminUploadScope,
  saveAdminImageUpload,
  validateAdminImageFile
} from '@/features/admin/upload-storage';
import { requireAdminSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file');

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'MISSING_FILE' }, { status: 400 });
  }

  const validationError = validateAdminImageFile(file);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  try {
    const result = await saveAdminImageUpload(
      file,
      normalizeAdminUploadScope(formData.get('scope'))
    );

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'UPLOAD_FAILED' }, { status: 500 });
  }
}
