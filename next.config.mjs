/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Next.js 15 flat ESLint config has a known serialization issue during build
    // ESLint still runs normally in development (npm run dev)
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
