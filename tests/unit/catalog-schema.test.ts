import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

import { publishableStatuses } from '@/features/catalog/constants';

describe('catalog constants', () => {
  it('exposes the publishable status order', () => {
    expect(publishableStatuses).toEqual([
      'draft',
      'pending',
      'published',
      'archived'
    ]);
  });
});

describe('catalog schema contract', () => {
  const schema = readFileSync('prisma/schema.prisma', 'utf8');
  const envExample = readFileSync('.env.example', 'utf8');
  const seed = readFileSync('prisma/seed.ts', 'utf8');

  it('keeps the category multilingual fields', () => {
    expect(schema).toContain('model Category');
    expect(schema).toContain('parentId');
    expect(schema).toContain('iconImageUrl');
    expect(schema).toContain('isActive');
    expect(schema).toContain('nameZh');
    expect(schema).toContain('descriptionPt');
  });

  it('keeps the product multilingual publish structure', () => {
    expect(schema).toContain('model Product');
    expect(schema).toContain('productCode');
    expect(schema).toContain('priceUsd');
    expect(schema).toContain('coverImageUrl');
    expect(schema).toContain('publishedAt');
    expect(schema).toContain('introEs');
    expect(schema).toContain('detailPt');
  });

  it('keeps the banner and message lifecycle fields', () => {
    expect(schema).toContain('targetType');
    expect(schema).toContain('targetId');
    expect(schema).toContain('targetUrl');
    expect(schema).toContain('processedAt');
    expect(schema).toContain('unsubscribed');
    expect(schema).not.toContain('subject');
  });

  it('keeps the expected env contract', () => {
    expect(envExample).toContain(
      'DATABASE_URL="postgresql://user:password@localhost:5432/cross"'
    );
    expect(envExample).toContain('ADMIN_USERNAME="admin"');
    expect(envExample).toContain('ADMIN_PASSWORD="ChangeMe123!"');
    expect(envExample).toContain('WHATSAPP_NUMBER="15551234567"');
  });

  it('seeds the first phase catalog data shape', () => {
    expect(seed).toContain('ADMIN_USERNAME');
    expect(seed).toContain('nameZh');
    expect(seed).toContain('priceUsd');
    expect(seed).toContain('coverImageUrl');
    expect(seed).toContain('targetType');
    expect(seed).not.toContain('subject');
  });

  it('uses a standard Prisma client singleton', () => {
    const db = readFileSync('src/lib/db.ts', 'utf8');

    expect(db).toContain('new PrismaClient');
    expect(db).toContain('log:');
    expect(db).not.toContain('adapter-pg');
    expect(db).not.toContain('pg');
  });
});
