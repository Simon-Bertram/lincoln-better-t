import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // CSP headers are now handled by middleware for better nonce support
  // Moved from experimental to root level in Next.js 15
  serverExternalPackages: [],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '', // Leave as empty string for standard HTTPS port (443)
        pathname: '/dulwhlyqt/**', // Crucial: This should be specific to your Cloudinary cloud name
      },
    ],
  },
};

export default nextConfig;
