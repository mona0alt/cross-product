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
});
