import { describe, expect, it } from 'vitest';

import {
  getLocalImagePath,
  requireLocalImagePath
} from '@/features/catalog/local-image-paths';

describe('local image path helpers', () => {
  it('keeps local image paths and clears remote image urls for display', () => {
    expect(getLocalImagePath('/uploads/products/cover.png')).toBe(
      '/uploads/products/cover.png'
    );
    expect(getLocalImagePath('https://images.example.com/cover.png')).toBeNull();
    expect(getLocalImagePath('http://images.example.com/cover.png')).toBeNull();
    expect(getLocalImagePath('//images.example.com/cover.png')).toBeNull();
  });

  it('rejects remote image urls before saving', () => {
    expect(requireLocalImagePath('/uploads/products/cover.png', 'coverImageUrl')).toBe(
      '/uploads/products/cover.png'
    );
    expect(() =>
      requireLocalImagePath('https://images.example.com/cover.png', 'coverImageUrl')
    ).toThrow('INVALID_LOCAL_coverImageUrl');
  });
});
