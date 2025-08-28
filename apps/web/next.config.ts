import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  headers() {
    return Promise.resolve([
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              // Script sources - use strict-dynamic for XSS protection
              "script-src 'strict-dynamic' 'unsafe-inline' https:",
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
            ].join('; '),
          },
          // Additional security headers
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=()',
          },
        ],
      },
    ]);
  },
};

export default nextConfig;
