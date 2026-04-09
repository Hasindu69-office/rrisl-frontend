import { NextRequest, NextResponse } from 'next/server';
import { normalizeLocale } from '@/app/lib/locale';

export function middleware(request: NextRequest) {
  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale'));
  const requestHeaders = new Headers(request.headers);

  requestHeaders.set('x-rrisl-locale', locale);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.cookies.set('rrisl-locale', locale, {
    path: '/',
    sameSite: 'lax',
  });

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
