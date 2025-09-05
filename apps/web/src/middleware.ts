import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(_request: NextRequest) {
  const response = NextResponse.next();

  // Performance-optimized CSP without nonces (allows static generation)
  const cspHeader = [
    // Default source - restrict to same origin
    "default-src 'self'",
    // Script sources - allow Next.js and Vercel Analytics
    `script-src 'self' 'unsafe-eval' 'unsafe-inline' https://va.vercel-scripts.com https://vitals.vercel-insights.com`,
    // Style sources - allow inline styles for Tailwind CSS
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com",
    // Object sources - block all (required for XSS protection)
    "object-src 'none'",
    // Base URI - block all (required for XSS protection)
    "base-uri 'none'",
    // Font sources - allow Google Fonts and data URIs
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
  ].join('; ');

  response.headers.set('Content-Security-Policy', cspHeader);

  // Add additional security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=()'
  );

  // Cross-Origin-Opener-Policy (COOP) for origin isolation
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');

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
