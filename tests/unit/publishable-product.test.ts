import { describe, expect, it } from 'vitest';

import { getPublishBlockers } from '@/features/catalog/publishable';

describe('product publish rules', () => {
  it('blocks publishing when one locale detail is missing', () => {
    const blockers = getPublishBlockers({
      productCode: 'SKU-001',
      priceUsd: 19.9,
      coverImageUrl: '/demo.jpg',
      categoryId: 'cat-1',
      nameZh: '中文',
      nameEn: 'English',
      nameEs: 'Espanol',
      namePt: 'Portugues',
      introZh: 'ok',
      introEn: 'ok',
      introEs: 'ok',
      introPt: 'ok',
      detailZh: 'ok',
      detailEn: 'ok',
      detailEs: '',
      detailPt: 'ok'
    });

    expect(blockers).toContain('detailEs');
  });
});
