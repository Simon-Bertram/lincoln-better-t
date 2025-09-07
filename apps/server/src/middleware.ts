import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

function getAllowedOrigins() {
  const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || [];
  const isDevelopment = process.env.NODE_ENV === 'development';
  const defaultAllowedOrigins = isDevelopment
    ? ['http://localhost:3000', 'http://localhost:3001']
    : [
        'https://lincoln-better-t.vercel.app',
        'https://lincoln-better-t-web.vercel.app',
        'https://lincoln-better-t-git-main-lincoln-better-t.vercel.app', // Vercel preview URLs
        'https://lincoln-better-t-web-git-main-lincoln-better-t.vercel.app',
      ];

  return [...allowedOrigins, ...defaultAllowedOrigins];
}

function setCorsHeaders(response: NextResponse, origin: string | null) {
  const allAllowedOrigins = getAllowedOrigins();

  // Debug logging (remove in production)
  if (process.env.NODE_ENV === 'development') {
    console.log('CORS Debug:', {
      origin,
      allowedOrigins: allAllowedOrigins,
      isAllowed: origin ? allAllowedOrigins.includes(origin) : false,
    });
  }

  if (origin && allAllowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  } else if (
    origin &&
    process.env.CORS_ORIGIN?.split(',').includes('*') &&
    !process.env.CORS_ALLOW_CREDENTIALS
  ) {
    response.headers.set('Access-Control-Allow-Origin', '*');
  }

  response.headers.set(
    'Access-Control-Allow-Methods',
    'GET,POST,PUT,PATCH,DELETE,OPTIONS'
  );
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With'
  );
}

export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin');

  // Handle preflight OPTIONS requests
  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 200 });
    setCorsHeaders(response, origin);
    response.headers.set('Access-Control-Max-Age', '86400'); // 24 hours
    return response;
  }

  const response = NextResponse.next();
  setCorsHeaders(response, origin);

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
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Note: We now include API routes and RPC routes to handle CORS
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
