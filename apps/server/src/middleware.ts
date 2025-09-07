import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Security-hardened CSP
  const cspHeader = [
    // Default source - restrict to same origin
    "default-src 'self'",
    // Script sources - restrict to specific domains only
    `script-src 'self' https://va.vercel-scripts.com https://vitals.vercel-insights.com`,
    // Style sources - allow Google Fonts and self
    "style-src 'self' https://fonts.googleapis.com",
    // Object sources - block all (required for XSS protection)
    "object-src 'none'",
    // Base URI - block all (required for XSS protection)
    "base-uri 'none'",
    // Font sources - allow Google Fonts only
    "font-src 'self' https://fonts.gstatic.com",
    // Image sources - restrict to specific domains
    "img-src 'self' data: https://images.unsplash.com https://via.placeholder.com",
    // Connect sources - restrict to specific API endpoints
    "connect-src 'self' https://lincoln-better-t-server.vercel.app https://va.vercel-scripts.com https://vitals.vercel-insights.com",
    // Media sources - allow self only
    "media-src 'self'",
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
    'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()'
  );

  // Only set HSTS in production with HTTPS
  if (
    process.env.NODE_ENV === 'production' &&
    request.nextUrl.protocol === 'https:'
  ) {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  // Cross-Origin-Opener-Policy (COOP) for origin isolation
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');

  // Cross-Origin-Embedder-Policy for additional isolation
  response.headers.set('Cross-Origin-Embedder-Policy', 'require-corp');

  // Cross-Origin-Resource-Policy
  response.headers.set('Cross-Origin-Resource-Policy', 'same-origin');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - rpc (RPC routes - handled by oRPC CORS plugin)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|rpc|_next/static|_next/image|favicon.ico).*)',
  ],
};
