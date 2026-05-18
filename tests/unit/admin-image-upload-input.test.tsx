import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import {
  AdminImageUploadInput,
  getAdminImagePreviewSrc,
  getAdminUploadedValue
} from '@/components/admin/admin-image-upload-input';

describe('AdminImageUploadInput', () => {
  it('prefers a local object URL for the visible preview while keeping the committed value separate', () => {
    expect(
      getAdminImagePreviewSrc({
        committedValue: '/uploads/products/cover.png',
        localPreviewUrl: 'blob:http://localhost/preview'
      })
    ).toBe('blob:http://localhost/preview');
  });

  it('updates the committed value with the uploaded URL for single-image inputs', () => {
    expect(
      getAdminUploadedValue({
        currentValue: '/uploads/products/old.png',
        uploadedUrl: '/uploads/products/new.png',
        multiline: false
      })
    ).toBe('/uploads/products/new.png');
  });

  it('renders the preview as a native image so local object URLs can be displayed', () => {
    const html = renderToStaticMarkup(
      <AdminImageUploadInput
        name="coverImageUrl"
        label="封面主图"
        uploadLabel="上传封面"
        defaultValue="/uploads/products/cover.png"
        scope="product"
        showPreview
      />
    );

    expect(html).toContain('data-admin-upload-preview="true"');
    expect(html).toContain('src="/uploads/products/cover.png"');
  });

  it('renders upload helper and preview status text from the provided copy', () => {
    const html = renderToStaticMarkup(
      <AdminImageUploadInput
        name="coverImageUrl"
        label="Cover image"
        uploadLabel="Upload cover"
        defaultValue="/uploads/products/cover.png"
        scope="product"
        showPreview
        uploadCopy={{
          hint: 'Supports JPG, PNG, WebP, GIF. Max 5MB each.',
          currentImage: 'Current image',
          configuredImage: 'Local image configured',
          emptyImage: 'No image configured',
          uploading: 'Uploading image...',
          uploaded: 'Image uploaded.',
          uploadedToInput: 'Image uploaded and inserted.',
          removeImage: 'Remove image',
          errors: {
            missingFile: 'Choose an image before uploading.',
            fileTooLarge: 'Image is too large. Max 5MB.',
            unsupportedFileType: 'Unsupported image format.',
            uploadFailed: 'Upload failed. Try again later.'
          }
        }}
      />
    );

    expect(html).toContain('Supports JPG, PNG, WebP, GIF. Max 5MB each.');
    expect(html).toContain('Current image');
    expect(html).toContain('Local image configured');
    expect(html).not.toContain('支持 JPG、PNG、WebP、GIF，单张不超过 5MB。');
    expect(html).not.toContain('当前图片');
    expect(html).not.toContain('本地图片已配置');
  });
});
