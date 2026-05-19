import { NextResponse } from 'next/server';

import { mapAdminProductCenterRows } from '@/features/admin/product-center-data';
import { getAdminProductList } from '@/features/catalog/queries';
import { requireAdminSession } from '@/lib/auth';
import { defaultLocale, isLocale } from '@/lib/i18n/config';

function getOptionalSearchParam(url: URL, name: string) {
  const value = url.searchParams.get(name)?.trim();

  return value || undefined;
}

export async function GET(request: Request) {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  }

  const url = new URL(request.url);
  const localeParam = getOptionalSearchParam(url, 'locale');
  const locale = isLocale(localeParam) ? localeParam : defaultLocale;
  const products = await getAdminProductList({
    search: getOptionalSearchParam(url, 'search'),
    status: getOptionalSearchParam(url, 'status'),
    categoryId: getOptionalSearchParam(url, 'categoryId')
  });

  return NextResponse.json({
    ok: true,
    products: mapAdminProductCenterRows(products, locale)
  });
}
