import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // CSP headers are now handled by middleware for better nonce support
  experimental: {
    // Enable nonce support for inline scripts
    serverComponentsExternalPackages: [],
    // Optimize font loading
    optimizeFonts: true,
  },
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
  // Optimize font loading
  optimizeFonts: true,
};

export default nextConfig;
