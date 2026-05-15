import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import {
  ADMIN_IMAGE_EXTENSIONS,
  MAX_ADMIN_UPLOAD_BYTES,
  type AdminUploadValidationError
} from '@/features/admin/upload-rules';
import { getRuntimeSystemSettings } from '@/features/admin/system-settings-actions';

export type AdminUploadScope = 'product' | 'banner' | 'category';

export const MAX_UPLOAD_BYTES = MAX_ADMIN_UPLOAD_BYTES;
export type UploadValidationError = Exclude<AdminUploadValidationError, 'UPLOAD_FAILED'>;

export function validateAdminImageFile(file: File): UploadValidationError | null {
  if (!file || file.size === 0) {
    return 'MISSING_FILE';
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return 'FILE_TOO_LARGE';
  }

  if (!(file.type in ADMIN_IMAGE_EXTENSIONS)) {
    return 'UNSUPPORTED_FILE_TYPE';
  }

  return null;
}

export function normalizeAdminUploadScope(value: FormDataEntryValue | null): AdminUploadScope {
  if (value === 'banner' || value === 'category') {
    return value;
  }

  return 'product';
}

export async function saveAdminImageUpload(
  file: File,
  scope: AdminUploadScope
) {
  const extension = ADMIN_IMAGE_EXTENSIONS[file.type as keyof typeof ADMIN_IMAGE_EXTENSIONS];
  const settings = await getRuntimeSystemSettings();
  const now = new Date();
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const segment =
    scope === 'banner'
      ? settings.upload.bannerSegment
      : scope === 'category'
        ? settings.upload.categorySegment
        : settings.upload.productSegment;
  const filename = `${randomUUID()}.${extension}`;
  const relativeUrl = `/uploads/${segment}/${year}/${month}/${filename}`;
  const directory = join(process.cwd(), 'public', 'uploads', segment, year, month);

  await mkdir(directory, { recursive: true });
  await writeFile(
    join(directory, filename),
    Buffer.from(await file.arrayBuffer())
  );

  return {
    url: relativeUrl
  };
}
