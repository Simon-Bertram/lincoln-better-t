import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // CSP headers are now handled by middleware for better nonce support
  // Moved from experimental to root level in Next.js 15
  serverExternalPackages: [],
  images: {
    domains: ['res.cloudinary.com'],
  },
};

export default nextConfig;
