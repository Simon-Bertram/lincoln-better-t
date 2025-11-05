import type { NextConfig } from "next";

/**
 * Pre-computed CSP header string for better performance
 * This is computed once at build time instead of on every request
 */
const cspHeader = [
  // Default source - restrict to same origin
  "default-src 'self'",
  // Script sources - allow Next.js and Vercel Analytics
  "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://va.vercel-scripts.com https://vitals.vercel-insights.com",
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
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  serverExternalPackages: [],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "", // Leave as empty string for standard HTTPS port (443)
        pathname: "/dulwhlyqt/**", // Crucial: This should be specific to your Cloudinary cloud name
      },
    ],
  },
  /**
   * Headers configuration - applied at build time for static routes
   * This is more performant than middleware because:
   * - Headers are pre-computed at build time
   * - No runtime overhead on edge functions
   * - Better caching behavior
   * - Faster response times
   */
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspHeader,
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
        ],
      },
      {
        // Cache static assets for 1 year (immutable)
        source: "/:all*(svg|jpg|jpeg|png|webp|gif|ico|woff|woff2|ttf|eot)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Cache Next.js static files
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
