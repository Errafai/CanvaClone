import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.externals = {
        ...config.externals,
        'jsdom': 'commonjs jsdom',
        'jsdom/lib/jsdom/living/generated/utils': 'commonjs jsdom/lib/jsdom/living/generated/utils',
      };
    }
    return config;
  },
};

export default nextConfig;
