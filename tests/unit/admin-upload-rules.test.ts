import { describe, expect, it } from 'vitest';

import {
  ADMIN_IMAGE_UPLOAD_HINT,
  getAdminUploadErrorMessage,
  validateAdminUploadFile
} from '@/features/admin/upload-rules';

describe('admin upload rules', () => {
  it('documents the current image upload limits for the admin UI', () => {
    expect(ADMIN_IMAGE_UPLOAD_HINT).toBe('支持 JPG、PNG、WebP、GIF，单张不超过 5MB。');
  });

  it('returns a clear error when an image is larger than 5MB', () => {
    const file = new File([new Uint8Array(5 * 1024 * 1024 + 1)], 'large.png', {
      type: 'image/png'
    });

    expect(validateAdminUploadFile(file)).toBe('FILE_TOO_LARGE');
    expect(getAdminUploadErrorMessage('FILE_TOO_LARGE')).toBe(
      '图片过大，单张图片不能超过 5MB。请压缩后重新上传。'
    );
  });

  it('returns a clear error for unsupported image types', () => {
    const file = new File(['text'], 'notes.txt', { type: 'text/plain' });

    expect(validateAdminUploadFile(file)).toBe('UNSUPPORTED_FILE_TYPE');
    expect(getAdminUploadErrorMessage('UNSUPPORTED_FILE_TYPE')).toBe(
      '图片格式不支持。请上传 JPG、PNG、WebP 或 GIF。'
    );
  });
});
