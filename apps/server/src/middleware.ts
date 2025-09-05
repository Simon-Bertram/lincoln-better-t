import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Generate a unique nonce for this request
  const nonce = crypto.randomUUID();

  // Secure CORS configuration
  const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || [];
  const origin = request.headers.get('origin');

  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }

  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set(
    'Access-Control-Allow-Methods',
    'GET,POST,PUT,PATCH,DELETE,OPTIONS'
  );
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With'
  );

  // Set CSP header with nonce-based policy
  response.headers.set(
    'Content-Security-Policy',
    [
      // Script sources - allow self, nonce, and strict-dynamic for Next.js compatibility
      `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-inline' https:`,
      // Object sources - block all (required for XSS protection)
      "object-src 'none'",
      // Base URI - block all (required for XSS protection)
      "base-uri 'none'",
      // Style sources - allow self, inline styles, Google Fonts, and Tailwind
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com",
      // Font sources - allow Google Fonts
      "font-src 'self' https://fonts.gstatic.com data:",
      // Image sources - allow self, data URIs, and common image formats
      "img-src 'self' data: blob: https:",
      // Connect sources - allow self and any HTTPS connections for API calls
      "connect-src 'self' https:",
      // Media sources - allow self and data URIs
      "media-src 'self' data:",
      // Form action - restrict to same origin
      "form-action 'self'",
      // Frame ancestors - block embedding in iframes
      "frame-ancestors 'none'",
      // Upgrade insecure requests
      'upgrade-insecure-requests',
    ].join('; ')
  );

  // Add additional security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=()'
  );
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains'
  );

  // Store nonce in request headers so it can be accessed in components
  response.headers.set('x-nonce', nonce);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
