export const ADMIN_IMAGE_EXTENSIONS = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif'
} as const;

export const MAX_ADMIN_UPLOAD_BYTES = 5 * 1024 * 1024;
export const ADMIN_IMAGE_ACCEPT = Object.keys(ADMIN_IMAGE_EXTENSIONS).join(',');
export const ADMIN_IMAGE_UPLOAD_HINT = '支持 JPG、PNG、WebP、GIF，单张不超过 5MB。';

export type AdminUploadValidationError =
  | 'MISSING_FILE'
  | 'FILE_TOO_LARGE'
  | 'UNSUPPORTED_FILE_TYPE'
  | 'UPLOAD_FAILED';

export type AdminUploadStatusTone = 'info' | 'success' | 'error';

export type AdminUploadErrorCopy = {
  missingFile: string;
  fileTooLarge: string;
  unsupportedFileType: string;
  uploadFailed: string;
};

const defaultAdminUploadErrorCopy: AdminUploadErrorCopy = {
  missingFile: '请选择一张图片后再上传。',
  fileTooLarge: '图片过大，单张图片不能超过 5MB。请压缩后重新上传。',
  unsupportedFileType: '图片格式不支持。请上传 JPG、PNG、WebP 或 GIF。',
  uploadFailed: '上传失败，请稍后重试。'
};

export function getAdminUploadErrorMessage(
  error: string | undefined,
  copy: AdminUploadErrorCopy = defaultAdminUploadErrorCopy
) {
  switch (error) {
    case 'MISSING_FILE':
      return copy.missingFile;
    case 'FILE_TOO_LARGE':
      return copy.fileTooLarge;
    case 'UNSUPPORTED_FILE_TYPE':
      return copy.unsupportedFileType;
    case 'UPLOAD_FAILED':
      return copy.uploadFailed;
    default:
      return error || copy.uploadFailed;
  }
}

export function validateAdminUploadFile(file: File): AdminUploadValidationError | null {
  if (!file || file.size === 0) {
    return 'MISSING_FILE';
  }

  if (file.size > MAX_ADMIN_UPLOAD_BYTES) {
    return 'FILE_TOO_LARGE';
  }

  if (!(file.type in ADMIN_IMAGE_EXTENSIONS)) {
    return 'UNSUPPORTED_FILE_TYPE';
  }

  return null;
}
