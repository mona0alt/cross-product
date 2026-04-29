import { NextResponse, type NextRequest } from 'next/server';

import { ADMIN_SESSION_COOKIE } from '@/lib/auth-constants';
import {
  defaultLocale,
  getPreferredLocale,
  locales
} from '@/lib/i18n/config';

const PUBLIC_FILE = /\.[^/]+$/;

function hasLocalePrefix(pathname: string) {
  return locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    const sessionCookie = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;

    if (!sessionCookie) {
      const loginUrl = new URL('/admin/login', request.url);

      if (pathname !== '/admin' || search) {
        loginUrl.searchParams.set('from', `${pathname}${search}`);
      }

      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  if (!hasLocalePrefix(pathname)) {
    const locale =
      pathname === '/'
        ? getPreferredLocale(request.headers.get('accept-language'))
        : defaultLocale;
    const redirectUrl = new URL(
      `/${locale}${pathname === '/' ? '' : pathname}`,
      request.url
    );
    redirectUrl.search = search;

    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)']
};
