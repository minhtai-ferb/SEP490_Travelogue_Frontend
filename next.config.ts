import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['dulich.tayninh.gov.vn', 'example.com', '.svg', 'res.cloudinary.com', 'i.imgur.com', 'img.freepik.com'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
