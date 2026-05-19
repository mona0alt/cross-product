import { NextResponse, type NextRequest } from 'next/server';

import {
  ADMIN_LOCALE_COOKIE,
  ADMIN_LOCALE_MAX_AGE
} from '@/lib/admin-locale-constants';
import { ADMIN_SESSION_COOKIE } from '@/lib/auth-constants';
import {
  defaultLocale,
  locales
} from '@/lib/i18n/config';

const PUBLIC_FILE = /\.[^/]+$/;

function hasLocalePrefix(pathname: string) {
  return locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
}

function applyDefaultAdminLocale(response: NextResponse) {
  response.cookies.set(ADMIN_LOCALE_COOKIE, defaultLocale, {
    path: '/admin',
    maxAge: ADMIN_LOCALE_MAX_AGE,
    sameSite: 'lax'
  });

  return response;
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
    const shouldResetAdminLocale = pathname === '/admin';

    if (!sessionCookie) {
      const loginUrl = new URL('/admin/login', request.url);

      if (pathname !== '/admin' || search) {
        loginUrl.searchParams.set('from', `${pathname}${search}`);
      }

      const response = NextResponse.redirect(loginUrl);

      return shouldResetAdminLocale
        ? applyDefaultAdminLocale(response)
        : response;
    }

    const response = NextResponse.next();

    return shouldResetAdminLocale
      ? applyDefaultAdminLocale(response)
      : response;
  }

  if (!hasLocalePrefix(pathname)) {
    const redirectUrl = new URL(
      `/${defaultLocale}${pathname === '/' ? '' : pathname}`,
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
