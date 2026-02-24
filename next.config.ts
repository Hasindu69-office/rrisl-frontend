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
        hostname: 'u4cco0sgocc0swookssgg4k8.148.116.105.184.sslip.io',
        pathname: '/uploads/**',
      },
    ],
  },
};

export default nextConfig;
