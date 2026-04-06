import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
      //For production/staging environments, you can add more patterns
      {
        protocol: 'https',
        hostname: 'v63yugwa3j9bootl01r65t51.77.42.26.240.sslip.io',
        pathname: '/uploads/**',
      },
    ],
  },
};

export default nextConfig;
