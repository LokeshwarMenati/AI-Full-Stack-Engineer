/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true
  },
  async rewrites() {
    // Only rewrite to external backend if EXPLICITLY configured
    if (process.env.BACKEND_API_URL) {
      return [
        {
          source: '/api/:path*',
          destination: `${process.env.BACKEND_API_URL}/:path*`
        }
      ];
    }
    return [];
  }
};

module.exports = nextConfig;
