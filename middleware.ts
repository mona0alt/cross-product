import { NextResponse, type NextRequest } from 'next/server';

import { ADMIN_SESSION_COOKIE } from '@/lib/auth-constants';

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname === '/admin/login' || pathname.startsWith('/api/admin')) {
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
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};
