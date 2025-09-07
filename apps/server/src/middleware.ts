import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

/**
 * Creates a comprehensive Content Security Policy header
 * @returns CSP header string
 */
function createCSPHeader(): string {
  return [
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
}

/**
 * Creates standard security headers
 * @returns Object containing security header key-value pairs
 */
function createSecurityHeaders(): Record<string, string> {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy':
      'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()',
  };
}

/**
 * Determines if HSTS header should be set based on environment and protocol
 * @param request - The incoming request
 * @returns True if HSTS should be set
 */
function shouldSetHSTS(request: NextRequest): boolean {
  return (
    process.env.NODE_ENV === 'production' &&
    request.nextUrl.protocol === 'https:'
  );
}

/**
 * Creates HSTS header value
 * @returns HSTS header value
 */
function createHSTSHeader(): string {
  return 'max-age=31536000; includeSubDomains; preload';
}

/**
 * Determines if CORS-related headers should be set based on request path
 * @param request - The incoming request
 * @returns True if CORS headers should be set
 */
function shouldSetCORSHeaders(request: NextRequest): boolean {
  return !request.nextUrl.pathname.startsWith('/rpc');
}

/**
 * Creates CORS-related headers
 * @returns Object containing CORS header key-value pairs
 */
function createCORSHeaders(): Record<string, string> {
  return {
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Embedder-Policy': 'require-corp',
    'Cross-Origin-Resource-Policy': 'same-origin',
  };
}

/**
 * Applies all security headers to the response
 * @param response - The response object to modify
 * @param request - The incoming request
 */
function applySecurityHeaders(
  response: NextResponse,
  request: NextRequest
): void {
  // Apply CSP header
  response.headers.set('Content-Security-Policy', createCSPHeader());

  // Apply standard security headers
  const securityHeaders = createSecurityHeaders();
  for (const [key, value] of Object.entries(securityHeaders)) {
    response.headers.set(key, value);
  }

  // Apply HSTS header conditionally
  if (shouldSetHSTS(request)) {
    response.headers.set('Strict-Transport-Security', createHSTSHeader());
  }

  // Apply CORS headers conditionally
  if (shouldSetCORSHeaders(request)) {
    const corsHeaders = createCORSHeaders();
    for (const [key, value] of Object.entries(corsHeaders)) {
      response.headers.set(key, value);
    }
  }
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  applySecurityHeaders(response, request);

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
