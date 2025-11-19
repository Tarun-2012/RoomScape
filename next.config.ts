/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Prevent Vercel ESLint failures
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Cloudinary, Replicate, Firebase
      },
    ],
  },
};

export default nextConfig;
