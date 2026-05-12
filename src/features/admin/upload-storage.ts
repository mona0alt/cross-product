import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

export type AdminUploadScope = 'product' | 'banner' | 'category';

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

const imageExtensions = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif'
} as const;

export type UploadValidationError =
  | 'MISSING_FILE'
  | 'FILE_TOO_LARGE'
  | 'UNSUPPORTED_FILE_TYPE';

export function validateAdminImageFile(file: File): UploadValidationError | null {
  if (!file || file.size === 0) {
    return 'MISSING_FILE';
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return 'FILE_TOO_LARGE';
  }

  if (!(file.type in imageExtensions)) {
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
  const extension = imageExtensions[file.type as keyof typeof imageExtensions];
  const now = new Date();
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const segment =
    scope === 'banner' ? 'banners' : scope === 'category' ? 'categories' : 'products';
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
