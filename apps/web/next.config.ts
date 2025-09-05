import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // CSP headers are now handled by middleware for better nonce support
  // Moved from experimental to root level in Next.js 15
  serverExternalPackages: [],
  // Configure webpack to handle nonces
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Add nonce support for client-side scripts
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

export default nextConfig;
